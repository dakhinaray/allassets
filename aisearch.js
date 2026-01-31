// Keep your existing JS logic
  $(document).ready(function () {
    const searchInput = $("#searchInput");
    const resultsPopup = $("#resultsPopup");
    const resultsContainer = $("#resultsContainer");
    const resultsContainerevent = $("#resultsContainerevent");
    const searchQuery = $("#searchQuery");

    const firstLoader = $(
      '<div class="text-center py-4 text-blue-600"><i class="fas fa-spinner fa-spin"></i> Loading results...</div>'
    );
    const secondLoader = $(
      '<div class="text-center py-4 text-blue-600"><i class="fas fa-spinner fa-spin"></i> Loading more results...</div>'
    );

    let timeout = null;

    searchInput.on("input", function () {
      clearTimeout(timeout);
      const query = this.value.trim();
      if (!query) {
        resultsPopup.addClass("hidden");
        return;
      }

      searchQuery.text(`"${query}"`);
      resultsContainer.empty();
      resultsContainerevent.empty();
      resultsPopup.removeClass("hidden");

      timeout = setTimeout(() => fetchResultsFromAPI(query), 500);
    });

    $(document).on("click", (e) => {
      if (!$(e.target).closest("#searchInput, #resultsPopup").length) {
        resultsPopup.addClass("hidden");
      }
    });

    function fetchResultsFromAPI(query) {
      resultsContainer.before(firstLoader);
      firstLoader.show();

      $.ajax({
        url: window.BASEURL+"/api/aisearch",
        type: "POST",
        data: { query },
        dataType: "json",
        success: (data) => {
          firstLoader.hide();
          displayResults(data, query, resultsContainer);
        },
        error: () => {
          firstLoader.hide();
          showError(resultsContainer, "Error fetching results");
        },
      });

      resultsContainerevent.before(secondLoader);
      secondLoader.show();

      $.ajax({
        url: window.BASEURL+"/api/aisearch",
        type: "POST",
        data: { query, type: "event" },
        dataType: "json",
        success: (data) => {
          secondLoader.hide();
          displayResults(data, query, resultsContainerevent);
        },
        error: () => {
          secondLoader.hide();
          showError(resultsContainerevent, "Error fetching event results");
        },
      });
    }

    function displayResults(data, query, container) {
      container.empty();
      if (!data?.length) return showNoResults(container, query);

      const html = data
        .filter((cat) => Array.isArray(cat.data) && cat.data.length)
        .map((cat) => createCategoryHTML(cat, query))
        .join("");
      container.html(html);
    }

    function createCategoryHTML(category, query) {
      const icon = getCategoryIcon(category.heading);
      const heading = capitalize(category.heading);

      const items = category.data
        .map(
          (item) => `
          <li>
  <a 
    href="${item.value || '#'}" 
    target="_blank"
    class="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
  >
    <i class="fas fa-circle text-[6px]"></i>
    <span class="truncate">${highlight(item.conference || item.text || '', query)}</span>
  </a>
</li>`
        )
        .join("");

      return `
        <div class="mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
  <div class="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100 mb-1">
    <span class="flex items-center gap-2">
      ${icon} ${heading}
    </span>
    <span class="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
      ${category.data.length}
    </span>
  </div>
  <ul class="pl-4 space-y-1">${items}</ul>
</div>`;
    }

    function getCategoryIcon(c) {
      const icons = {
        country: '<i class="fas fa-globe"></i>',
        state: '<i class="fas fa-map-marked-alt"></i>',
        city: '<i class="fas fa-city"></i>',
        topic: '<i class="fas fa-tag"></i>',
        month: '<i class="fas fa-calendar-alt"></i>',
        combined: '<i class="fas fa-layer-group"></i>',
        events: '<i class="fas fa-calendar-check"></i>',
      };
      return icons[c] || '<i class="fas fa-list"></i>';
    }

    const capitalize = (s) =>
      s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
    const highlight = (text = "", q = "") =>
      q
        ? text.replace(
            new RegExp(`(${q})`, "gi"),
            '<span class="bg-yellow-200">$1</span>'
          )
        : text;

    function showError(container, message) {
      container.html(`
        <div class="text-center py-6 text-gray-500">
          <i class="fas fa-exclamation-circle text-2xl mb-2 text-red-500"></i>
          <p>${message}</p>
          <p class="text-sm">Please try again later</p>
        </div>`);
    }

    function showNoResults(container, query) {
      container.html(`
        <div class="text-center py-6 text-gray-500">
          <i class="fas fa-search text-2xl mb-2"></i>
          <p>No results found for "${query}"</p>
          <p class="text-sm">Try different keywords or browse our categories</p>
        </div>`);
    }
  });