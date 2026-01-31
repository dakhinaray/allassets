document.addEventListener('DOMContentLoaded', function() {
  try {
    const form = document.getElementById('create_org');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateForm(event) {
      event.preventDefault();

      const data = {
        email: document.getElementById('org_mail').value.trim(),
      };

      if (!data.email || !validateEmail(data.email)) return showStatusModal('error', 'Please enter a valid email address.');

      sendFormDataToAPI(data);
    }

    function sendFormDataToAPI(payload) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
      showStatusModal('loading', 'Submitting...');

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;

      $.ajax({
        url: window.BASEURL + '/api/forgotPassword',
        type: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json',
        dataType: 'json',
        headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {},
        success: function(result) {
          if (result.status) {
            showStatusModal('success', result.message || 'Organizer added successfully!');
            form.reset();
          } else {
            const msg = result.message || result.error || 'Failed to submit form.';
            showStatusModal('error', msg);
          }
        },
        error: function(xhr) {
          const msg = xhr.responseJSON?.message || 'Network error. Please try again.';
          showStatusModal('error', msg);
        },
        complete: function() {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        }
      });
    }

    form.addEventListener('submit', validateForm);

  } catch (err) {
    console.error('Error initializing Organizer form:', err);
  }
});