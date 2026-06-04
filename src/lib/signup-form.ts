/**
 * Signup Form Logic
 */
const signupForm = document.querySelector('#signup-form') as HTMLFormElement;
const signupStatus = document.querySelector('#signup-status') as HTMLDivElement;
const signupStatusSuccess = document.querySelector('#signup-status-success') as HTMLDivElement;

const nameInput = signupForm.querySelector('#signup-name') as HTMLInputElement;
const emailInput = signupForm.querySelector('#signup-email') as HTMLInputElement;
const phoneInput = signupForm.querySelector('#signup-phone') as HTMLInputElement;
const submitBtn = signupForm.querySelector('.cta-submit-btn') as HTMLButtonElement;
const submitBtnText = submitBtn.textContent;

type CountryCode = import('libphonenumber-js').CountryCode;

let AsYouTypeClass: (new (country?: CountryCode) => any) | null = null;
let parsePhoneNumberFromString: ((input: string, defaultCountry?: CountryCode) => any) | null = null;

// ---------------------------------------------------------------
// Phone input – attached on page load, outside the submit handler
// ---------------------------------------------------------------
if (phoneInput) {
  const onPhoneInput = () => {
    const raw = phoneInput.value;
    const cursorPos = phoneInput.selectionStart ?? raw.length;

    // Count digits strictly left of the cursor (used to restore position later)
    const digitsBeforeCursor = (raw.slice(0, cursorPos).match(/\d/g) ?? []).length;

    // Step 1 – extract only digits, preserve a leading '+'
    const digits = raw.startsWith('+')
      ? '+' + raw.slice(1).replace(/\D/g, '')
      : raw.replace(/\D/g, '');

    // Step 2 – format with a fresh formatter (stateless per keystroke)
    const formatted = AsYouTypeClass
      ? new AsYouTypeClass('US').input(digits)
      : digits;
    phoneInput.value = formatted;

    // Step 3 – restore cursor to the position after the same digit count
    let seen = 0;
    let newCursor = formatted.length; // fallback: end of string
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) seen++;
      if (seen === digitsBeforeCursor) {
        newCursor = i + 1;
        break;
      }
    }
    phoneInput.setSelectionRange(newCursor, newCursor);

    // Step 4 – validate passing 'US' as fallback for local numbers
    const num = parsePhoneNumberFromString
      ? parsePhoneNumberFromString(phoneInput.value, 'US')
      : null;

    if (parsePhoneNumberFromString) {
      phoneInput.setCustomValidity(
        num && num.isValid() ? '' : 'Please enter a valid phone number.'
      );
    }
  };

  phoneInput.addEventListener('input', onPhoneInput);

  // Lazy‑load libphonenumber‑js (does not block page load)
  import('libphonenumber-js')
    .then(mod => {
      AsYouTypeClass = mod.AsYouType;
      parsePhoneNumberFromString = mod.parsePhoneNumberFromString;
      // Trigger validation once loaded in case user typed before download finished
      if (phoneInput.value) onPhoneInput();
    })
    .catch(console.error);
}

// ---------------------------------------------------------------
// Submit handler
// ---------------------------------------------------------------
signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  signupStatus.textContent = '';
  signupStatus.className = 'signup-status';

  // 1. Await fallback: Ensure the library is loaded if the user submits too fast
  if (!parsePhoneNumberFromString) {
    try {
      const mod = await import('libphonenumber-js');
      AsYouTypeClass = mod.AsYouType;
      parsePhoneNumberFromString = mod.parsePhoneNumberFromString;
    } catch (error) {
      console.error('Failed to load phone validation library', error);
    }
  }

  // 2. Parse and validate the input value
  const rawPhone = phoneInput.value.trim();
  const num = parsePhoneNumberFromString!(rawPhone, 'US');

  phoneInput.setCustomValidity(
    num && num.isValid() ? '' : 'Please enter a valid phone number.'
  );

  // 3. Trigger native browser validity UI
  if (!signupForm.checkValidity() || !num) {
    signupForm.reportValidity();
    return;
  }

  // 4. Extract the clean, machine-readable E.164 phone number
  const normalizedPhone = num.format('E.164');
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  nameInput.disabled = true;
  emailInput.disabled = true;
  phoneInput.disabled = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Signing up...';

  const hostname = window.location.hostname;
  const url = (hostname === 'localhost' || hostname === '127.0.0.1')
    ? 'http://localhost:8000/signup'
    : 'https://real-learning.duckdns.org/signup';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone: normalizedPhone }),
    });

    if (response.ok) {
      signupForm.classList.add('signup-form--success');
      signupStatus.innerHTML = signupStatusSuccess.innerHTML;
    } else {
      throw new Error('Server responded with an error');
    }
  } catch (error) {
    nameInput.disabled = false;
    emailInput.disabled = false;
    phoneInput.disabled = false;
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtnText;
    signupStatus.textContent = 'Something went wrong. Our bad. Please text us instead.';
    signupStatus.classList.add('status--error');
  }
});
