

document.addEventListener('DOMContentLoaded', function () {
    const { allCategories, csrfToken } = window.APP_DATA || {};
    console.log(allCategories);
    const categorySelect = document.getElementById('event-category');
    const topicsContainer = document.getElementById('topics-container');
    if (!categorySelect || !topicsContainer) return;

    categorySelect.addEventListener('change', function () {
        const selectedId = this.value;
        console.log(selectedId);
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
        console.debug('Validation script initializing for #add-event-form');
        const form = document.getElementById('add-event-form');
        if (!form) {
            console.error('Form with id "add-event-form" not found. Validation will not be attached.');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');

        // ----------------------------
        // FORM VALIDATION
        // ----------------------------
        function validateForm(event) {
            event.preventDefault();

            const data = {
                name: document.getElementById("name").value.trim(),
                email: document.getElementById("email").value.trim(),
                country_code: document.getElementById("country_code").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                organization: document.getElementById("organization").value.trim(),
                designation: document.getElementById("designation").value,
                prefCountry1: document.getElementById("pref-country-1").value,
                prefCountry2: document.getElementById("pref-country-2").value,
                prefCountry3: document.getElementById("pref-country-3").value,
                category: document.getElementById("event-category").value,
                recaptcha_token: document.getElementById("recaptcha_token").value,
                topics: Array.from(document.querySelectorAll('input[name="event-topics[]"]:checked')).map(c => c.value)
            };

            // --- Basic validation ---
            if (!data.name) {
                showStatusModal("error", "Please enter your name.");
                return;
            }
            if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                showStatusModal("error", "Please enter a valid email address.");
                return;
            }
            if (!data.country_code) {
                showStatusModal("error", "Please select a country code for your phone.");
                return;
            }
            if (!data.phone || !/^[0-9\s\-\+]{6,20}$/.test(data.phone)) {
                showStatusModal("error", "Please enter a valid phone number.");
                return;
            }
            if (!data.organization) {
                showStatusModal("error", "Please enter your university/organisation.");
                return;
            }
            if (!data.category) {
                showStatusModal("error", "Please select a category.");
                return;
            }
            if (!data.topics || data.topics.length === 0) {
                showStatusModal("error", "Please select at least one topic.");
                return;
            }

            // Send data
            sendFormDataToAPI(data);
        }

        // ----------------------------
        // API SUBMIT
        // ----------------------------
        async function sendFormDataToAPI(payload) {
            try {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
                showStatusModal('loading'); // Show loading modal

                const csrfToken = document.querySelector('meta[name="csrf-token"]')
                    ? document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    : null;

                $.ajax({
                    url: window.BASEURL+'/api/subscribe',
                    type: 'POST',
                    data: JSON.stringify(payload),
                    contentType: 'application/json',
                    dataType: 'json',
                    headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {},
                    success: function (result) {
                        if (result.success) {
                            showStatusModal('success', result.message || 'Event added successfully!');
                            form.reset();

                            // Collapse topics container if exists
                            const topicsContainer = document.getElementById('topics-container');
                            if (topicsContainer) topicsContainer.style.display = 'none';
                        } else {
                            const msg = result.message || result.error || 'Failed to add event.';
                            showStatusModal('error', msg);
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('AJAX Error:', status, error);
                        let msg = 'Network error. Please try again.';
                        if (xhr.responseJSON && xhr.responseJSON.message) {
                            msg = xhr.responseJSON.message;
                        }
                        showStatusModal('error', msg);
                    },
                    complete: function () {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                    }
                });

            } catch (err) {
                console.error(err);
                showStatusModal('error', 'Unexpected error. Please try again.');
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            }
        }

        // ----------------------------
        // INIT
        // ----------------------------
        form.addEventListener('submit', validateForm);
        console.debug('Validation submit handler attached to #add-event-form');
    } catch (initErr) {
        console.error('Error initializing validation script:', initErr);
    }
});