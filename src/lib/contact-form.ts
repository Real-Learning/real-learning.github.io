/**
 * Contact Form Logic
 */
import { hide, reveal, setupPhoneInput, submitForm } from './form-utils.ts';

const contactDialog = document.querySelector('#contact-dialog') as HTMLDialogElement;
const contactUsBtn = document.querySelector('#contact-us-btn') as HTMLButtonElement;
const contactCloseBtn = document.querySelector('#contact-dialog-close') as HTMLButtonElement;
const contactForm = document.querySelector('#contact-form') as HTMLFormElement;
const contactSuccessMsg = document.querySelector('#contact-success-msg') as HTMLDivElement;
const contactOkBtn = document.querySelector('#contact-ok-btn') as HTMLButtonElement;

const nameInput = document.querySelector('#contact-name') as HTMLInputElement;
const phoneInput = document.querySelector('#contact-phone') as HTMLInputElement;
const questionInput = document.querySelector('#contact-question') as HTMLTextAreaElement;
const submitBtn = document.querySelector('#contact-submit-btn') as HTMLButtonElement;
const contactErrorMsg = document.querySelector('#contact-error-msg') as HTMLDivElement;

let isSuccessState = false;

// Function to close dialog and reset state
const closeDialog = () => {
  if (contactDialog) {
    contactDialog.close();
  }
};

if (contactUsBtn && contactDialog && contactForm && nameInput && phoneInput && questionInput && submitBtn && contactErrorMsg && contactSuccessMsg && contactOkBtn && contactCloseBtn) {
  const phoneControl = setupPhoneInput(phoneInput);

  // Event listener for opening dialog
  contactUsBtn.addEventListener('click', () => {
    isSuccessState = false;
    contactForm.reset();
    phoneInput.setCustomValidity('');
    hide(contactErrorMsg);

    reveal(contactForm);
    hide(contactSuccessMsg);

    nameInput.disabled = false;
    phoneInput.disabled = false;
    questionInput.disabled = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send';

    contactDialog.showModal();
    nameInput.focus();
  });

  contactCloseBtn.addEventListener('click', closeDialog);
  contactOkBtn.addEventListener('click', closeDialog);

  // Close on backdrop click (checking both click and release started and ended outside the form wrapper,
  // and the cursor never crossed the form wrapper boundary in-between)
  let pointerTouchedInside = false;
  const onWrapperPointerEnter = () => {
    pointerTouchedInside = true;
  };

  contactDialog.addEventListener('mousedown', (event) => {
    if (event.target !== contactDialog) {
      pointerTouchedInside = true;
      return;
    }
    pointerTouchedInside = false;
    const wrapper = contactDialog.querySelector('.contact-dialog-wrapper');
    if (wrapper) {
      wrapper.addEventListener('pointerenter', onWrapperPointerEnter, { once: true });
    }
  });

  contactDialog.addEventListener('mouseup', (event) => {
    const wrapper = contactDialog.querySelector('.contact-dialog-wrapper');
    if (wrapper) {
      wrapper.removeEventListener('pointerenter', onWrapperPointerEnter);
    }
    if (!pointerTouchedInside && event.target === contactDialog) {
      closeDialog();
    }
  });

  // Enter key press in success state should close dialog
  contactDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && isSuccessState) {
      event.preventDefault();
      closeDialog();
    }
  });

  // Clean up when dialog closes
  contactDialog.addEventListener('close', () => {
    isSuccessState = false;
  });

  // Submit handler
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    hide(contactErrorMsg);

    const normalizedPhone = await phoneControl.validateAndFormat();

    if (!contactForm.checkValidity() || !normalizedPhone) {
      contactForm.reportValidity();
      return;
    }

    const name = nameInput.value.trim();
    const question = questionInput.value.trim();

    await submitForm({
      submitBtn,
      inputs: [nameInput, phoneInput, questionInput],
      loadingText: 'Sending...',
      endpoint: '/question',
      payload: { name, phone: normalizedPhone, message: question },
      onSuccess: () => {
        console.log('Success submitting question:');
        hide(contactForm);
        reveal(contactSuccessMsg);
        isSuccessState = true;
        contactOkBtn.focus();
      },
      onError: (errText) => {
        console.log('Error submitting question:');
        console.log(errText);
        contactErrorMsg.innerHTML = errText;
        reveal(contactErrorMsg);
      }
    });
  });
}
