/**
 * Signup Form Logic
 */
import { setupPhoneInput, submitForm } from './form-utils.ts';

const signupForm = document.querySelector('#signup-form') as HTMLFormElement;
const signupStatus = document.querySelector('#signup-status') as HTMLDivElement;
const signupStatusSuccess = document.querySelector('#signup-status-success') as HTMLDivElement;

const nameInput = signupForm?.querySelector('#signup-name') as HTMLInputElement;
const emailInput = signupForm?.querySelector('#signup-email') as HTMLInputElement;
const phoneInput = signupForm?.querySelector('#signup-phone') as HTMLInputElement;
const submitBtn = signupForm?.querySelector('.cta-submit-btn') as HTMLButtonElement;

if (signupForm && nameInput && emailInput && phoneInput && submitBtn) {
  const phoneControl = setupPhoneInput(phoneInput);

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (signupStatus) {
      signupStatus.textContent = '';
      signupStatus.className = 'signup-status';
    }

    const normalizedPhone = await phoneControl.validateAndFormat();

    if (!signupForm.checkValidity() || !normalizedPhone) {
      signupForm.reportValidity();
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    await submitForm({
      submitBtn,
      inputs: [nameInput, emailInput, phoneInput],
      loadingText: 'Signing up...',
      endpoint: '/signup',
      payload: { name, email, phone: normalizedPhone },
      onSuccess: () => {
        signupForm.classList.add('signup-form--success');
        if (signupStatus && signupStatusSuccess) {
          signupStatus.innerHTML = signupStatusSuccess.innerHTML;
        }
      },
      onError: (errText) => {
        if (signupStatus) {
          signupStatus.innerHTML = errText;
          signupStatus.classList.add('status--error');
        }
      }
    });
  });
}
