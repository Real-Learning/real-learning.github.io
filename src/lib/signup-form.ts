/**
 * Signup Form Logic
 */
import { hide, reveal, setupPhoneInput, submitForm } from './form-utils.ts';

const signupForm = document.querySelector('#signup-form') as HTMLFormElement;
const signupErrorMsg = document.querySelector('#signup-error-msg') as HTMLDivElement;
const signupSuccessMsg = document.querySelector('#signup-success-msg') as HTMLDivElement;

const nameInput = signupForm?.querySelector('#signup-name') as HTMLInputElement;
const emailInput = signupForm?.querySelector('#signup-email') as HTMLInputElement;
const phoneInput = signupForm?.querySelector('#signup-phone') as HTMLInputElement;
const submitBtn = signupForm?.querySelector('#cta-submit-btn') as HTMLButtonElement;

if (signupForm && nameInput && emailInput && phoneInput && submitBtn) {
  const phoneControl = setupPhoneInput(phoneInput);

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

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
        console.log('Success submitting signup:');
        hide(signupForm);
        if (signupSuccessMsg) {
          reveal(signupSuccessMsg);
        }
      },
      onError: (errText) => {
        console.log('Error submitting signup:');
        console.log(errText);
        if (signupErrorMsg) {
          signupErrorMsg.innerHTML = errText;
          reveal(signupErrorMsg);
        }
      }
    });
  });
}
