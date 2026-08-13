(() => {
  const consumerEmailRoots = new Set(['gmail.com', 'googlemail.com', 'hotmail.com', 'outlook.com', 'yahoo.com']);
  const consumerEmailVariants = new Set(['hotmail.co.uk', 'hotmail.fr', 'hotmail.de', 'hotmail.it', 'hotmail.es', 'hotmail.com.au', 'hotmail.co.jp', 'hotmail.co.in', 'hotmail.com.br', 'hotmail.com.mx', 'outlook.co.uk', 'outlook.fr', 'outlook.de', 'outlook.it', 'outlook.es', 'outlook.com.au', 'outlook.co.jp', 'outlook.co.in', 'outlook.com.br', 'yahoo.co.uk', 'yahoo.ca', 'yahoo.com.au', 'yahoo.co.in', 'yahoo.fr', 'yahoo.de', 'yahoo.es', 'yahoo.it', 'yahoo.co.jp', 'yahoo.com.br', 'yahoo.com.mx', 'yahoo.co.nz', 'yahoo.com.sg', 'yahoo.com.hk', 'yahoo.com.ar', 'yahoo.com.tr']);
  const message = 'Please use your company email address. Gmail, Yahoo, Hotmail, and Outlook.com accounts are not eligible for this brief.';

  const isConsumerEmail = (value) => {
    const domain = value.trim().toLowerCase().split('@').pop()?.replace(/\.+$/, '') || '';
    return consumerEmailRoots.has(domain) || consumerEmailVariants.has(domain) || [...consumerEmailRoots].some((root) => domain.endsWith('.' + root));
  };

  const initializeCorporateEmailValidation = () => {
    document.querySelectorAll('form[data-corporate-email-only]').forEach((form) => {
      if (form.dataset.corporateEmailValidationBound === 'true') return;
      const email = form.querySelector('input[type="email"]');
      if (!email) return;

      const emailId = email.id || 'corporate-email-' + document.querySelectorAll('input[type="email"]').length;
      email.id = emailId;
      const error = document.createElement('span');
      error.className = 'corporate-email-error';
      error.id = emailId + '-error';
      error.setAttribute('role', 'tooltip');
      error.setAttribute('data-corporate-email-error', 'true');
      error.hidden = true;
      error.textContent = message;
      email.insertAdjacentElement('afterend', error);

      const describedBy = new Set((email.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
      describedBy.add(error.id);
      email.setAttribute('aria-describedby', [...describedBy].join(' '));

      const clearError = () => {
        email.setCustomValidity('');
        email.removeAttribute('aria-invalid');
        error.hidden = true;
      };
      const validate = () => {
        if (!isConsumerEmail(email.value)) {
          clearError();
          return true;
        }
        email.setCustomValidity(message);
        email.setAttribute('aria-invalid', 'true');
        error.hidden = false;
        return false;
      };

      email.addEventListener('blur', validate);
      email.addEventListener('input', () => {
        if (isConsumerEmail(email.value)) {
          if (!error.hidden) validate();
        } else {
          clearError();
        }
      });
      form.addEventListener('submit', (event) => {
        if (validate()) return;
        event.preventDefault();
        email.focus({ preventScroll: true });
        email.reportValidity();
      });
      form.dataset.corporateEmailValidationBound = 'true';
    });
  };

  initializeCorporateEmailValidation();
  document.addEventListener('astro:page-load', initializeCorporateEmailValidation);
})();
