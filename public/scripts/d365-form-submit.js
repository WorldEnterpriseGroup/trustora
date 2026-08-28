(() => {
  const formSelector = 'form[data-d365-form]';
  const applicationIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const createSubmissionId = () => {
    if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID();
    if (typeof globalThis.crypto?.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      globalThis.crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
    }
    return '';
  };

  const getStatus = (form) => {
    const existing = form.querySelector('[data-d365-status]');
    if (existing) return existing;
    const status = document.createElement('p');
    status.className = 'form-note d365-form-status';
    status.dataset.d365Status = 'true';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitButton) submitButton.insertAdjacentElement('beforebegin', status);
    else form.append(status);
    return status;
  };

  const setStatus = (status, message, state) => {
    status.textContent = message;
    status.dataset.state = state;
  };

  const initializeD365Forms = () => {
    document.querySelectorAll(formSelector).forEach((form) => {
      if (!(form instanceof HTMLFormElement) || form.dataset.d365FormBound === 'true') return;
      const status = getStatus(form);
      form.addEventListener('submit', async (event) => {
        if (event.defaultPrevented) return;
        event.preventDefault();
        if (form.dataset.submitting === 'true') return;

        const idField = form.elements.namedItem('application-id');
        if (idField instanceof HTMLInputElement && !applicationIdPattern.test(idField.value)) idField.value = createSubmissionId();

        form.dataset.submitting = 'true';
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton instanceof HTMLButtonElement || submitButton instanceof HTMLInputElement) submitButton.disabled = true;
        setStatus(status, 'Sending securely to the Trustora intake service…', 'pending');

        try {
          const body = new URLSearchParams();
          new FormData(form).forEach((value, key) => {
            if (typeof value === 'string') body.append(key, value);
          });
          const result = await fetch(form.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
          });
          if (!result.ok) throw new Error('d365_intake_failed');
          form.reset();
          setStatus(status, 'Thanks — your submission was accepted by the Trustora intake service and routed to D365 for review.', 'success');
        } catch {
          setStatus(status, 'We could not submit this form to the Trustora intake service. Please try again.', 'error');
        } finally {
          form.dataset.submitting = 'false';
          if (submitButton instanceof HTMLButtonElement || submitButton instanceof HTMLInputElement) submitButton.disabled = false;
        }
      });
      form.dataset.d365FormBound = 'true';
    });
  };

  initializeD365Forms();
  document.addEventListener('astro:page-load', initializeD365Forms);
})();
