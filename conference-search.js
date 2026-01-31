document.addEventListener("DOMContentLoaded", function () {


    const cityList = document.getElementById("city-list");
    const citySearch = document.getElementById("city-search");

    if (!cityList || !citySearch) return;

    // Enable default city search
    citySearch.addEventListener("input", function () {
        const query = this.value.toLowerCase();

        cityList.querySelectorAll(".city-item").forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? "block" : "none";
        });
    });

    document.querySelectorAll(".city-item").forEach(item => {
        item.addEventListener("click", function () {
            document.getElementById("city-selected-text").textContent = this.textContent;
            document.getElementById("city-hidden").value = this.dataset.value;

            // show reset button
            document.querySelector('[data-reset-for="city"]').classList.remove("hidden");
        });
    });


    /* ----------------------------------------------------------------------
       UNIVERSAL CUSTOM DROPDOWN HANDLER (Country, City, Topic)
    ---------------------------------------------------------------------- */
    document.querySelectorAll(".custom-dropdown").forEach(dropdown => {

        const selected = document.getElementById(dropdown.dataset.selected);
        const menu = document.getElementById(dropdown.dataset.menu);
        const search = document.getElementById(dropdown.dataset.search);
        const selectedText = document.getElementById(dropdown.dataset.selectedText);
        const hidden = document.getElementById(dropdown.dataset.hidden);
        const itemClass = dropdown.dataset.itemClass;

        /** OPEN/CLOSE DROPDOWN **/
        selected.addEventListener("click", () => {
            menu.classList.toggle("hidden");
            search.focus();
        });

        /** CLOSE WHEN CLICKING OUTSIDE **/
        document.addEventListener("click", e => {
            if (!dropdown.contains(e.target)) {
                menu.classList.add("hidden");
            }
        });

        /** SEARCH FILTER **/
        search.addEventListener("keyup", function () {
            const q = this.value.toLowerCase();
            menu.querySelectorAll("." + itemClass).forEach(item => {
                item.style.display = item.textContent.toLowerCase().includes(q)
                    ? "block"
                    : "none";
            });
        });

        /** EVENT DELEGATION - WORKS FOR STATIC + DYNAMIC ITEMS **/
        menu.addEventListener("click", function (e) {

            const item = e.target.closest("." + itemClass);
            if (!item) return;

            // Set selected values
            selectedText.textContent = item.textContent.trim();
            hidden.value = item.dataset.value;
            menu.classList.add("hidden");

            dropdown.querySelector(".reset-btn").classList.remove("hidden");





            if (dropdown.dataset.selected === "country-selected") {

                // RESET state
                document.getElementById("state-hidden").value = "";
                document.getElementById("state-selected-text").textContent = "Select State";
                document.getElementById("state-wrapper").classList.add("hidden");

                // Reset state list
                document.getElementById("state-list").innerHTML = `
        <li class="px-3 py-2 text-primary opacity-70">Select country first...</li>
    `;

                // RESET city
                document.getElementById("city-hidden").value = "";
                document.getElementById("city-selected-text").textContent = "Select City";

                // Reset city list
                document.getElementById("city-list").innerHTML = `
        <li class="px-3 py-2 text-primary opacity-70">Select country first...</li>
    `;

                // Now load based on new country
                countryId = item.dataset.value;
                stateId = 0;
                loadCities(countryId, stateId)

                loadStates(item.dataset.value);


            }


            if (dropdown.dataset.selected === "state-selected") {

                // SET state ID in new hidden field
                document.getElementById("state-id-hidden").value = item.dataset.id;

                // RESET city
                document.getElementById("city-hidden").value = "";
                document.getElementById("city-selected-text").textContent = "Select City";

                // Reset city list
                document.getElementById("city-list").innerHTML = `
                    <li class="px-3 py-2 text-primary opacity-70">Select country first...</li>
                `;

                // Now load based on new country
                countryId = 0;
                stateId = item.dataset.id
                loadCities(countryId, stateId)
                // loadStates(item.dataset.value);
            }




        });

    });

    /* ----------------------------------------------------------------------
       DATE RANGE PICKER
    ---------------------------------------------------------------------- */
    if (document.getElementById('conference-date-range')) {
        flatpickr("#conference-date-range", {
            mode: "range",
            dateFormat: "Y-m-d",
            minDate: "today",
            allowInput: true
        });
    }

    /* ----------------------------------------------------------------------
       SEARCH + MODAL + PAGINATION
    ---------------------------------------------------------------------- */

    const form = document.getElementById('conference-search-form');
    const dateInput = document.getElementById('conference-date-range');
    const modal = document.getElementById('searchResultsModal');
    const closeModalBtn = document.getElementById('closeSearchResultsModal');
    const loader = document.getElementById('searchResultsLoader');
    const content = document.getElementById('searchResultsContent');
    const errorBox = document.getElementById('searchResultsError');

    let lastSearchPayload = {};

    function openModal() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('overflow-hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    /* -------------------------- FETCH EVENTS -------------------------- */
    async function fetchEvents(page = 1) {

        loader.classList.remove('hidden');
        content.innerHTML = `
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                Search Results
            </h2>
            <p class="text-gray-500 dark:text-gray-400 text-center">Fetching results...</p>`;

        errorBox.classList.add('hidden');

        const formData = new FormData();
        Object.entries(lastSearchPayload).forEach(([k, v]) => formData.append(k, v));
        formData.append('page', page);

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': window.csrfToken },
                body: formData
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();
            loader.classList.add('hidden');

            const events = result.data || [];
            const total = result.total ?? events.length;
            const currentPage = result.current_page ?? 1;
            const lastPage = result.last_page ?? 1;

            if (events.length > 0) {

                content.innerHTML = `
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                        Search Results (${total})
                    </h2>

                    <div class="space-y-4">
                        ${events.map(item => `
                            <div class="flex flex-col sm:flex-row items-start sm:items-center 
                                        bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md 
                                        transition p-4 border border-gray-100 dark:border-gray-700">

                                <div class="flex-grow">
                                    <h3 class="font-bold text-lg text-primary dark:text-white leading-tight">
                                        <a href="${window.BASEURL}/event/${item.event_id}" 
                                           class="hover:underline" target="_blank">
                                            ${item.event_name}
                                        </a>
                                    </h3>

                                    <p class="text-gray-600 dark:text-gray-400 flex flex-wrap items-center 
                                              mt-2 text-sm gap-x-3 gap-y-1">

                                        <span class="inline-flex items-center">
                                            <i class="fas fa-map-marker-alt w-4 mr-2 text-gray-400"></i>
                                            ${[item.city, item.state, item.country?.split('#')[1]]
                        .filter(Boolean).join(', ')}
                                        </span>

                                        <span class="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>

                                        <span class="inline-flex items-center">
                                            <i class="fas fa-calendar-alt w-4 mr-2 text-gray-400"></i>
                                            ${item.event_stat
                        ? new Date(item.event_stat).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })
                        : 'TBA'}
                                        </span>

                                        <span class="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>

                                        <span class="inline-flex items-center">
                                            <i class="fas fa-book-bookmark w-4 mr-2 text-gray-400"></i>
                                            ${item.event_topic?.split('###')[2] ?? 'General'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    ${lastPage > 1 ? `
                        <div class="flex justify-center items-center mt-6 space-x-3">
                            <button id="prevPageBtn"
                                    class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg 
                                           hover:bg-gray-300 dark:hover:bg-gray-600 
                                           disabled:opacity-50"
                                    ${currentPage <= 1 ? 'disabled' : ''}> ← Prev </button>

                            <span class="text-gray-500 dark:text-gray-400">
                                Page ${currentPage} of ${lastPage}
                            </span>

                            <button id="nextPageBtn"
                                    class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg 
                                           hover:bg-gray-300 dark:hover:bg-gray-600 
                                           disabled:opacity-50"
                                    ${currentPage >= lastPage ? 'disabled' : ''}> Next → </button>
                        </div>` : ''}
                `;

                // Pagination
                const prevBtn = document.getElementById("prevPageBtn");
                const nextBtn = document.getElementById("nextPageBtn");

                if (prevBtn) prevBtn.addEventListener("click", () => fetchEvents(currentPage - 1));
                if (nextBtn) nextBtn.addEventListener("click", () => fetchEvents(currentPage + 1));

            } else {
                content.innerHTML = `
                    <div class="text-center py-8">
                        <p class="text-gray-500 dark:text-gray-400 text-lg">No events found.</p>
                    </div>`;
            }

        } catch (err) {
            console.error('Search error:', err);
            loader.classList.add('hidden');
            content.innerHTML = '';
            errorBox.classList.remove('hidden');
        }
    }

    /* -------------------------- FORM SUBMIT -------------------------- */
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const dateValue = dateInput?.value || '';
            let start_date = '', end_date = '';

            if (dateValue.includes(" to ")) {
                const [s, e2] = dateValue.split(" to ");
                start_date = s.trim();
                end_date = e2.trim();
            } else if (dateValue) {
                start_date = dateValue.trim();
            }

            // Get values from hidden inputs
            const countryValue = document.getElementById('country-hidden')?.value || '';
            const cityValue = document.getElementById('city-hidden')?.value || '';
            const topicValue = document.getElementById('event-topics-hidden')?.value || '';
            const stateValue = document.getElementById('state-hidden')?.value || '';

            lastSearchPayload = {
                country: countryValue,
                state: stateValue,
                city: cityValue,
                topic: topicValue,
                start_date,
                end_date
            };

            if (!countryValue && !topicValue && !start_date && !cityValue) {
                alert("Please select at least one filter.");
                return;
            }

            openModal();
            fetchEvents(1);
        });
    }
});

/* ----------------------------------------------------------------------
   LOAD CITIES FOR SELECTED COUNTRY
---------------------------------------------------------------------- */
function loadCities(countryId = 0, stateId = 0) {

    const cityList = document.getElementById("city-list");

    cityList.innerHTML = `
        <li class="px-3 py-2 text-primary opacity-70">Loading cities...</li>
    `;
    if (countryId != 0) {
        var apiUrl = window.BASEURL + `/api/country/${countryId}`;
    } else {
        var apiUrl = window.BASEURL + `/api/state/${stateId}`;
    }


    fetch(apiUrl)
        .then(r => r.json())
        .then(data => {

            if (!data || data.length === 0) {
                cityList.innerHTML = `
                    <li class="px-3 py-2 text-primary opacity-70">No cities found</li>`;
                return;
            }

            cityList.innerHTML = data.map(city => `
                <li class="px-3 py-2 cursor-pointer city-item 
                           text-primary dark:text-gray-200 text-left 
                           bg-white/90 dark:bg-gray-800/80 hover:bg-accent hover:text-white
                           border-b border-gray-100 dark:border-gray-700 transition duration-150"
                    data-value="${city.pleace_name}">
                    ${city.pleace_name}
                </li>
            `).join("");
        });
}


function loadStates(countryId) {

    const stateWrapper = document.getElementById("state-wrapper");
    const stateList = document.getElementById("state-list");

    const countryBox = document.querySelector("[data-item-class='country-item']").closest(".custom-dropdown");
    const cityBox = document.querySelector("[data-item-class='city-item']").closest(".custom-dropdown");

    stateList.innerHTML = `
        <li class="px-3 py-2 text-primary opacity-70">Loading states...</li>
    `;

    fetch(window.BASEURL + `/api/getstate/${countryId}`)
        .then(r => r.json())
        .then(data => {

            if (!data || data.length === 0) {

                // Hide state dropdown
                stateWrapper.classList.add("hidden");

                // Remove minimized width
                // countryBox.classList.remove("w-44", "md:w-44");
                // cityBox.classList.remove("w-44", "md:w-44");

                $("#conference-search-grid")
                    .addClass("md:grid-cols-5")
                    .removeClass("md:grid-cols-6");

                stateList.innerHTML = `
                    <li class="px-3 py-2 text-primary opacity-70">No states found</li>
                `;
                return;
            }

            // SHOW state dropdown
            stateWrapper.classList.remove("hidden");

            // ADD minimized width class to all 3
            // stateWrapper.classList.add("w-44", "md:w-44");
            // countryBox.classList.add("w-44", "md:w-44");
            // cityBox.classList.add("w-44", "md:w-44");

            $("#conference-search-grid")
                .removeClass("md:grid-cols-5")
                .addClass("md:grid-cols-6");

            // Render list
            stateList.innerHTML = data.map(state => `
            <li class="px-3 py-2 cursor-pointer state-item 
                    text-primary dark:text-gray-200 text-left 
                    bg-white/90 dark:bg-gray-800/80 hover:bg-accent hover:text-white
                    border-b border-gray-100 dark:border-gray-700 
                    transition duration-150"
                    data-id="${state.state_id}"
                data-value="${state.state_name}">
                ${state.state_name}
            </li>
        `).join("");
        });
}


/* --------------------------------------------------------------
   RESET BUTTON LOGIC (Country, State, City)
-------------------------------------------------------------- */

document.querySelectorAll(".reset-btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
        e.stopPropagation(); // prevent opening dropdown

        const field = this.dataset.resetFor;

        if (field === "country") {
            $("#conference-search-grid")
                .addClass("md:grid-cols-5")
                .removeClass("md:grid-cols-6");


            // RESET country
            document.getElementById("country-hidden").value = "";
            document.getElementById("country-selected-text").textContent = "Choose Country";
            this.classList.add("hidden");

            // RESET state
            document.getElementById("state-hidden").value = "";
            document.getElementById("state-selected-text").textContent = "Select State";
            document.getElementById("state-wrapper").classList.add("hidden");
            document.getElementById("state-list").innerHTML = `
                <li class="px-3 py-2 text-primary opacity-70">Select country first...</li>
            `;

            // RESET city
            document.getElementById("city-hidden").value = "";
            document.getElementById("city-selected-text").textContent = "Select City";
            document.getElementById("city-list").innerHTML = `
                <li class="px-3 py-2 text-primary opacity-70">Select country first...</li>
            `;
            document.querySelector('[data-reset-for="city"]').classList.add("hidden");

            // 🔥 Reload ALL cities
            loadAllCities();

            // Hide city reset button
            document
                .querySelector('[data-reset-for="city"]')
                .classList.add("hidden");
        }

        if (field === "state") {

            // Reset state
            document.getElementById("state-hidden").value = "";
            document.getElementById("state-selected-text").textContent = "Select State";
            this.classList.add("hidden");

            // Reset city as well
            document.getElementById("city-hidden").value = "";
            document.getElementById("city-selected-text").textContent = "Select City";
            document.querySelector('[data-reset-for="city"]').classList.add("hidden");


            // Clear city list and show default message
            document.getElementById("city-list").innerHTML = `
                <li class="px-3 py-2 text-primary opacity-70">Select state first...</li>
            `;

            // Do NOT call loadCities() because no state is selected

            // Now load based on new country

            var countryValue = $('#country-hidden').val();

            countryId = countryValue;
            stateId = 0;
            loadCities(countryId, stateId)
        }


        if (field === "city") {
            document.getElementById("city-hidden").value = "";
            document.getElementById("city-selected-text").textContent = "Select City";
            this.classList.add("hidden");
        }
    });
});


function loadAllCities() {
    const cityList = document.getElementById("city-list");
    cityList.innerHTML = "";

    allcityList.forEach(city => {
        const li = document.createElement("li");
        li.className = `
            px-3 py-2 cursor-pointer text-primary dark:text-gray-200 text-left
            bg-white/90 dark:bg-gray-800/80 hover:bg-accent hover:text-white
            border-b border-gray-100 dark:border-gray-700 transition duration-150
            city-item
        `;
        li.dataset.value = city;
        li.textContent = city;

        li.addEventListener("click", function () {
            document.getElementById("city-selected-text").textContent = city;
            document.getElementById("city-hidden").value = city;

            document
                .querySelector('[data-reset-for="city"]')
                .classList.remove("hidden");
        });

        cityList.appendChild(li);
    });
}