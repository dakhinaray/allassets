document.addEventListener('DOMContentLoaded', function () {
    const { allCategories, csrfToken } = window.APP_DATA || {};
    // const allCategories = @json($allCategoryTopics);
    const categorySelect = document.getElementById('event-category');
    const topicsContainer = document.getElementById('topics-container');
    if (!categorySelect || !topicsContainer) return;

    categorySelect.addEventListener('change', function () {
        const selectedId = this.value;
        const selectedCategory = allCategories.find(cat => cat.id == selectedId);

        // Clear previous topics
        topicsContainer.innerHTML = '';

        if (selectedCategory && selectedCategory.topics && selectedCategory.topics.length > 0) {
            selectedCategory.topics.forEach(topic => {
                const checkboxWrapper = document.createElement('div');
                checkboxWrapper.classList.add('flex', 'items-center', 'gap-2', 'p-2', 'border', 'border-gray-300');
                checkboxWrapper.classList.add('rounded-lg', 'hover:bg-gray-100', 'dark:border-gray-600', 'dark:hover:bg-gray-700');
                checkboxWrapper.classList.add('transition', 'cursor-pointer');

                // Use topic ID as value (safer for backend lookup) and include title as label
                checkboxWrapper.innerHTML = `
                    <input type="checkbox" id="topic-${topic.topic_id}" name="event-topics[]" value="${topic.topic}" class="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded">
                    <label for="topic-${topic.topic_id}" class="ml-2 text-gray-700 dark:text-gray-300">${topic.topic}</label>
                `;
                topicsContainer.appendChild(checkboxWrapper);
            });
            topicsContainer.style.display = 'grid';
        } else {
            topicsContainer.style.display = 'none';
        }
    });
});



document.addEventListener('DOMContentLoaded', function () {
    try {
        console.debug('Initializing event validation for #add-event-form');
        const form = document.getElementById('add-event-form');
        if (!form) return console.error('Form with id "add-event-form" not found.');

        const submitBtn = form.querySelector('button[type="submit"]');

        // ----------------------------
        // VALIDATION HELPERS
        // ----------------------------
        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function validateUrl(url) {
            const regex = /^((https?:\/\/)?([\w-]+\.)+[a-zA-Z]{2,})(\/[\w\-._~:\/?#[\]@!$&'()*+,;=]*)?$/;
            return regex.test(url);
        }

        // ----------------------------
        // FORM VALIDATION
        // ----------------------------
        function validateForm(event) {
            event.preventDefault();

            const data = {
                eventName: document.getElementById('event_name').value.trim(),
                country: document.getElementById('country').value,
                state: document.getElementById('state').value.trim(),
                city: document.getElementById('city').value.trim(),
                venue: document.getElementById('venue').value.trim(),
                orgSociety: document.getElementById('org_society').value.trim(),
                contactPerson: document.getElementById('ev_contact_p').value.trim(),
                enquiriesEmail: document.getElementById('ev_enq_email').value.trim(),
                websiteUrl: document.getElementById('ev_url').value.trim(),
                startDate: document.getElementById('ev_start_date').value,
                endDate: document.getElementById('ev_end_date').value,
                abstDeadline: document.getElementById('dead_abst').value,
                description: document.getElementById('ev_desc').value.trim(),
                category: document.getElementById('event-category').value,
                organizer: document.getElementById('organizer').value,
                organizerMail: document.getElementById('organizerMail').value,
                recaptcha_token: document.getElementById("recaptcha_token").value,
                topics: Array.from(document.querySelectorAll('input[name="event-topics[]"]:checked')).map(c => c.value),
            };

            // Validation checks
            if (!data.eventName) return showStatusModal('error', 'Event name is required.');
            if (!data.country) return showStatusModal('error', 'Please select a country.');
            if (!data.state) return showStatusModal('error', 'State or Province is required.');
            if (!data.city) return showStatusModal('error', 'City is required.');
            if (!data.venue) return showStatusModal('error', 'Venue is required.');
            if (!data.orgSociety) return showStatusModal('error', 'Organizing society is required.');
            if (!data.contactPerson) return showStatusModal('error', 'Contact person is required.');
            if (!data.enquiriesEmail || !validateEmail(data.enquiriesEmail))
                return showStatusModal('error', 'Please enter a valid enquiries email.');
            if (!data.websiteUrl || !validateUrl(data.websiteUrl))
                return showStatusModal('error', 'Please enter a valid website URL.');
            if (!data.startDate || !data.endDate || !data.abstDeadline)
                return showStatusModal('error', 'All date fields are required.');

            // Validate date logic
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            const abst = new Date(data.abstDeadline);
            if (isNaN(start) || isNaN(end) || isNaN(abst))
                return showStatusModal('error', 'Please provide valid dates.');
            if (start > end)
                return showStatusModal('error', 'Start date cannot be after end date.');
            if (abst >= start)
                return showStatusModal('error', 'Abstract deadline must be before the start date.');

            if (!data.description)
                return showStatusModal('error', 'Description is required.');
            if (!data.category)
                return showStatusModal('error', 'Please select a category.');
            if (!data.topics.length)
                return showStatusModal('error', 'Please select at least one topic.');

            if (!/^https?:\/\//i.test(data.websiteUrl))
                data.websiteUrl = 'http://' + data.websiteUrl;

            // Valid — Submit
            sendEventFormDataToAPI(data);
        }

        // ----------------------------
        // AJAX SUBMISSION
        // ----------------------------
        async function sendEventFormDataToAPI(payload) {
            try {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
                showStatusModal('loading', 'Submitting event...');

                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;

                $.ajax({
                    url: window.BASEURL + '/api/addEvent',
                    type: 'POST',
                    data: JSON.stringify(payload),
                    contentType: 'application/json',
                    dataType: 'json',
                    headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {},
                    success: function (result) {
                        if (result.success) {
                            showStatusModal('success', result.message || 'Event added successfully!');
                            form.reset();

                            const topicsContainer = document.getElementById('topics-container');
                            if (topicsContainer) topicsContainer.style.display = 'none';
                        } else {
                            const msg = result.message || result.error || 'Failed to add event.';
                            showStatusModal('error', msg);
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('AJAX Error:', status, error);
                        const msg = xhr.responseJSON?.message || 'Network error. Please try again.';
                        showStatusModal('error', msg);
                    },
                    complete: function () {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                    },
                });
            } catch (err) {
                console.error('Unexpected error:', err);
                showStatusModal('error', 'Unexpected error. Please try again.');
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            }
        }

        // ----------------------------
        // INIT
        // ----------------------------
        form.addEventListener('submit', validateForm);
        console.debug('Submit handler attached to #add-event-form');
    } catch (err) {
        console.error('Error initializing event form:', err);
    }
});
