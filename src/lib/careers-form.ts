/**
 * Careers Application Form Logic
 */
import { setupPhoneInput, submitForm } from './form-utils.ts';

const careersForm = document.querySelector('#careers-form') as HTMLFormElement;
const careersStatus = document.querySelector('#careers-status') as HTMLDivElement;
const careersStatusSuccess = document.querySelector('#careers-status-success') as HTMLDivElement;

const nameInput = careersForm?.querySelector('#careers-name') as HTMLInputElement;
const emailInput = careersForm?.querySelector('#careers-email') as HTMLInputElement;
const phoneInput = careersForm?.querySelector('#careers-phone') as HTMLInputElement;
const resumeInput = careersForm?.querySelector('#careers-resume') as HTMLInputElement;
const messageInput = careersForm?.querySelector('#careers-message') as HTMLTextAreaElement;
const submitBtn = careersForm?.querySelector('.careers-submit-btn') as HTMLButtonElement;

if (careersForm && nameInput && emailInput && phoneInput && resumeInput && messageInput && submitBtn) {
  const phoneControl = setupPhoneInput(phoneInput);

  careersForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (careersStatus) {
      careersStatus.textContent = '';
      careersStatus.className = 'careers-status';
    }

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
        careersForm.classList.add('careers-form--success');
        if (careersStatus && careersStatusSuccess) {
          careersStatus.innerHTML = careersStatusSuccess.innerHTML;
        }
      },
      onError: (errText) => {
        if (careersStatus) {
          careersStatus.innerHTML = errText;
          careersStatus.classList.add('status--error');
        }
      },
    });
  });
}
