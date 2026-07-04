/**
 * Contact Form Logic
 */
import { setupPhoneInput, submitForm } from './form-utils.ts';

const contactDialog = document.querySelector('#contact-dialog') as HTMLDialogElement;
const contactUsBtn = document.querySelector('#contact-us-btn') as HTMLButtonElement;
const contactCloseBtn = document.querySelector('#contact-dialog-close') as HTMLButtonElement;
const contactForm = document.querySelector('#contact-form') as HTMLFormElement;
const contactFormContainer = document.querySelector('#contact-form-container') as HTMLDivElement;
const contactSuccessContainer = document.querySelector('#contact-success-container') as HTMLDivElement;
const contactOkBtn = document.querySelector('#contact-ok-btn') as HTMLButtonElement;

const nameInput = document.querySelector('#contact-name') as HTMLInputElement;
const phoneInput = document.querySelector('#contact-phone') as HTMLInputElement;
const questionInput = document.querySelector('#contact-question') as HTMLTextAreaElement;
const submitBtn = document.querySelector('.contact-submit-btn') as HTMLButtonElement;
const statusDiv = document.querySelector('#contact-status') as HTMLDivElement;

let isSuccessState = false;

// Function to close dialog and reset state
const closeDialog = () => {
  if (contactDialog) {
    contactDialog.close();
  }
};

if (contactForm && nameInput && phoneInput && questionInput && submitBtn) {
  const phoneControl = setupPhoneInput(phoneInput);

  // Event listener for opening dialog
  if (contactUsBtn && contactDialog) {
    contactUsBtn.addEventListener('click', () => {
      isSuccessState = false;
      contactForm.reset();
      phoneInput.setCustomValidity('');
      if (statusDiv) {
        statusDiv.textContent = '';
        statusDiv.className = 'contact-status';
      }

      if (contactFormContainer) {
        contactFormContainer.style.display = 'block';
        contactFormContainer.removeAttribute('aria-hidden');
      }
      if (contactSuccessContainer) {
        contactSuccessContainer.style.display = 'none';
        contactSuccessContainer.setAttribute('aria-hidden', 'true');
      }

      nameInput.disabled = false;
      phoneInput.disabled = false;
      questionInput.disabled = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send';

      contactDialog.showModal();
      nameInput.focus();
    });
  }

  // Close event triggers
  if (contactCloseBtn) {
    contactCloseBtn.addEventListener('click', closeDialog);
  }
  if (contactOkBtn) {
    contactOkBtn.addEventListener('click', closeDialog);
  }

  // Close on backdrop click (checking both click and release started and ended outside the form wrapper,
  // and the cursor never crossed the form wrapper boundary in-between)
  let pointerTouchedInside = false;
  const onWrapperPointerEnter = () => {
    pointerTouchedInside = true;
  };

  if (contactDialog) {
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
  }

  // Submit handler
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (statusDiv) {
      statusDiv.textContent = '';
      statusDiv.className = 'contact-status';
    }

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
        if (contactFormContainer) {
          contactFormContainer.style.display = 'none';
          contactFormContainer.setAttribute('aria-hidden', 'true');
        }
        if (contactSuccessContainer) {
          contactSuccessContainer.style.display = 'flex';
          contactSuccessContainer.removeAttribute('aria-hidden');
        }
        isSuccessState = true;
        if (contactOkBtn) {
          contactOkBtn.focus();
        }
      },
      onError: (errText) => {
        if (statusDiv) {
          statusDiv.innerHTML = errText;
          statusDiv.classList.add('status--error');
        }
      }
    });
  });
}
