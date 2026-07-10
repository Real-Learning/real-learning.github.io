/**
 * Shared Form and Validation Utilities
 */
import type { CountryCode } from 'libphonenumber-js';

let AsYouTypeClass: (new (country?: CountryCode) => any) | null = null;
let parsePhoneNumberFromString: ((input: string, defaultCountry?: CountryCode) => any) | null = null;
let phoneLibPromise: Promise<typeof import('libphonenumber-js')> | null = null;

/**
 * Lazy-loads libphonenumber-js exactly once.
 */
export async function loadPhoneLib() {
  if (!phoneLibPromise) {
    phoneLibPromise = import('libphonenumber-js').then((mod) => {
      AsYouTypeClass = mod.AsYouType;
      parsePhoneNumberFromString = mod.parsePhoneNumberFromString;
      return mod;
    });
  }
  return phoneLibPromise;
}

/**
 * Sets up formatting and validation on a phone input element.
 */
export function setupPhoneInput(phoneInput: HTMLInputElement) {
  const onPhoneInput = () => {
    const raw = phoneInput.value;
    const cursorPos = phoneInput.selectionStart ?? raw.length;
    const digitsBeforeCursor = (raw.slice(0, cursorPos).match(/\d/g) ?? []).length;

    const digits = raw.startsWith('+')
      ? '+' + raw.slice(1).replace(/\D/g, '')
      : raw.replace(/\D/g, '');

    const formatted = AsYouTypeClass
      ? new AsYouTypeClass('US').input(digits)
      : digits;
    phoneInput.value = formatted;

    let seen = 0;
    let newCursor = formatted.length;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) seen++;
      if (seen === digitsBeforeCursor) {
        newCursor = i + 1;
        break;
      }
    }
    phoneInput.setSelectionRange(newCursor, newCursor);

    if (parsePhoneNumberFromString) {
      const num = parsePhoneNumberFromString(phoneInput.value, 'US');
      phoneInput.setCustomValidity(
        num && num.isValid() ? '' : 'Please enter a valid phone number.'
      );
    }
  };

  phoneInput.addEventListener('input', onPhoneInput);

  loadPhoneLib()
    .then(() => {
      if (phoneInput.value) {
        onPhoneInput();
      }
    })
    .catch(console.error);

  return {
    validateAndFormat: async (): Promise<string | null> => {
      await loadPhoneLib();
      const raw = phoneInput.value.trim();
      const num = parsePhoneNumberFromString ? parsePhoneNumberFromString(raw, 'US') : null;
      if (num && num.isValid()) {
        phoneInput.setCustomValidity('');
        return num.format('E.164');
      } else {
        phoneInput.setCustomValidity('Please enter a valid phone number.');
        return null;
      }
    }
  };
}

interface SubmitOptions {
  submitBtn: HTMLButtonElement;
  inputs: (HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement)[];
  loadingText: string;
  endpoint: string; // e.g. '/signup' or '/question'
  payload: Record<string, any>;
  onSuccess: () => void;
  onError: (errorText: string) => void;
}

/**
 * Handles posting form data as JSON, managing input states during submission.
 */
export async function submitForm({
  submitBtn,
  inputs,
  loadingText,
  endpoint,
  payload,
  onSuccess,
  onError,
}: SubmitOptions) {
  const originalBtnText = submitBtn.textContent || '';

  inputs.forEach(input => {
    input.disabled = true;
  });
  submitBtn.disabled = true;
  submitBtn.textContent = loadingText;

  const hostname = window.location.hostname;
  const baseUrl = (hostname === 'localhost' || hostname === '127.0.0.1')
    ? 'http://localhost:8000'
    : 'https://api.reallearning.io';
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      onSuccess();
    } else {
      console.log(response)
      throw new Error('Server responded with an error');
    }
  } catch (error) {
    console.log(error)
    inputs.forEach(input => {
      input.disabled = false;
    });
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;

    const errMsg = `Can't send the form. Our bad. Please \
    <a href="${import.meta.env.VITE_CORP_PHONE_HREF}"><span class="phrase">text us</span></a> \
    or \
    <a href="${import.meta.env.VITE_CORP_EMAIL_HREF}"><span class="phrase">send us an email</span></a> \
    instead.`;
    onError(errMsg);
  }
}

export function hide(el: HTMLElement) {
  el.setAttribute('aria-hidden', 'true');
  el.classList.add('hidden');
}

export function reveal(el: HTMLElement) {
  el.classList.remove('hidden');
  el.removeAttribute('aria-hidden');
}
