/**
 * Careers Application Form Logic
 */
import { hide, reveal, setupPhoneInput, submitForm } from './form-utils.ts';

const careersForm = document.querySelector('#careers-form') as HTMLFormElement;
const careersErrorMsg = document.querySelector('#careers-error-msg') as HTMLDivElement;
const careersSuccessMsg = document.querySelector('#careers-success-msg') as HTMLDivElement;

const nameInput = careersForm?.querySelector('#careers-name') as HTMLInputElement;
const emailInput = careersForm?.querySelector('#careers-email') as HTMLInputElement;
const phoneInput = careersForm?.querySelector('#careers-phone') as HTMLInputElement;
const resumeInput = careersForm?.querySelector('#careers-resume') as HTMLInputElement;
const messageInput = careersForm?.querySelector('#careers-message') as HTMLTextAreaElement;
const submitBtn = careersForm?.querySelector('#careers-submit-btn') as HTMLButtonElement;

if (careersForm && nameInput && emailInput && phoneInput && resumeInput && messageInput && submitBtn && careersErrorMsg && careersSuccessMsg) {
  const phoneControl = setupPhoneInput(phoneInput);

  careersForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const normalizedPhone = await phoneControl.validateAndFormat();

    // Prepend https:// if the user omitted the protocol, so type="url" validation passes.
    const rawLink = resumeInput.value.trim();
    if (rawLink && !rawLink.match(/^https?:\/\//i)) {
      resumeInput.value = `https://${rawLink}`;
    }

    if (!careersForm.checkValidity() || !normalizedPhone) {
      careersForm.reportValidity();
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const resume_link = resumeInput.value.trim();
    const message = messageInput.value.trim();

    await submitForm({
      submitBtn,
      inputs: [nameInput, emailInput, phoneInput, resumeInput, messageInput],
      loadingText: 'Sending...',
      endpoint: '/job_application',
      payload: { name, email, phone: normalizedPhone, resume_link, message },
      onSuccess: () => {
        console.log('Success submitting job_application:');
        hide(careersForm);
        reveal(careersSuccessMsg);
      },
      onError: (errText) => {
        console.log('Error submitting job_application:');
        console.log(errText);
        careersErrorMsg.innerHTML = errText;
        reveal(careersErrorMsg);
      },
    });
  });
}
