/*  PROMOTION  Left Banner BANNER  */


function fetch_promotions(page = 1, params = {}) {
    params['page'] = page;
    // window.BASEURL
    // Show loader
    // $("#loaderModal").removeClass("hidden");
    showDivLoader("left_page_banner");
    $.ajax({
        url: window.BASEURL + "/api/promotions",
        type: "POST",
        data: params,
        dataType: "json",
        success: function (response) {
            if (!response.success || !response.data.length) {
                $("#left_page_banner").html(
                    "<p class='text-center text-gray-500 py-8'>No Left promotions found.</p>"
                );
                return;
            }

            let html = '';

            $.each(response.data, function (index, promo) {
                const promoUrl = promo.url ?? '#';
                const imgSrc = promo.image ? window.BASEURL + `/ad/${promo.image}` : '';
                html += `
                        <a href="${promoUrl}" target="_blank"
                            class="block group bg-white dark:bg-darkCard rounded-md shadow-md border-2 border-gray-600 dark:border-gray-700  hover:border-accent transition-shadow duration-300 ease-in-out overflow-hidden flex-shrink-0 w-11/12 sm:w-3/4 md:w-auto snap-center first:ml-6 last:mr-6 md:first:ml-0 md:last:mr-0">
                            <img src="${imgSrc}" alt="${promo.alt ?? 'Promotion'}"
                                class="transition-transform duration-300 group-hover:scale-105 w-full object-cover">
                        </a>
                    `;
            });

            $("#left_page_banner").html(html);
        },
        error: function () {
            $("#left_page_banner").html(
                "<p class='text-center text-red-500 py-8'>Failed to load promotions.</p>"
            );
        },
        complete: function () {
            // Hide loader
            $("#loaderModal").addClass("hidden");
        }
    });
}

// $(document).ready(function () {
//     fetch_promotions(1, {
//         topic: 'Technology',
//         ad_type: 'Top',
//         country: 'India',
//         displaypage: 'Country'
//     });
// });



/*  PROMOTION  TOP BANNER  */

function fetch_top_banner_promotions(page = 1, params = {}) {
    params['page'] = page;

    // Show loader
    // $("#loaderModal").removeClass("hidden");
    showDivLoader("top_head_banner");
    $.ajax({
        url: window.BASEURL + "/api/promotions#top",
        type: "POST",
        data: params,
        dataType: "json",
        success: function (response) {
            if (!response.success || !response.data.length) {
                $("#top_head_banner").html(
                    "<p class='text-center text-gray-500 py-8'>No Top promotions found.</p>"
                );
                $("#top_head_banner").hide();
                // $("#top_hed_banner").hide();
                return;
            }

            let html = '';

            $.each(response.data, function (index, promo) {
                const promoUrl = promo.url ?? '#';
                const imgSrc = promo.image ? window.BASEURL + `/ad/${promo.image}` : '';
                
                html += `                        
                        <a href="${promoUrl}" target="_blank" rel="noopener noreferrer" aria-label="View details for Big Data, Smart Computing and Computer Science Conference" class="block group bg-white dark:bg-darkCard rounded-md shadow-md border-2 border-gray-600 dark:border-gray-700  hover:border-accent transition-shadow duration-300 ease-in-out overflow-hidden flex-shrink-0 w-11/12 sm:w-3/4 md:w-auto snap-center first:ml-6 last:mr-6 md:first:ml-0 md:last:mr-0">
                   <img src="${imgSrc}" alt="${promo.alt ?? 'Promotion'}" class="h-42 w-full object-cover transition-transform duration-300">
                </a>
                    `;
            });

            $("#top_head_banner").html(html);
        },
        error: function () {
            // $("#top_head_banner").html(
            //     "<p class='text-center text-red-500 py-8'>Failed to load promotions.</p>"
            // );
        },
        complete: function () {
            // Hide loader
            $("#loaderModal").addClass("hidden");
        }
    });
}

// $(document).ready(function () {
//     fetch_top_banner_promotions(1, {
//         topic: '',
//         ad_type: 'Top',
//         country: 'India',
//         displaypage: 'Country'
//     });
// });


/*  PROMOTION  Home Right BANNER  */

function fetch_home_right_banner_promotions(page = 1, params = {}) {
    params['page'] = page;
    params['ad_type'] = 'FR_RIGHT';

    // SELECT * FROM `ad_image` WHERE `ad_type`='FR_RIGHT'  ORDER BY `id` DESC
    // window.BASEURL
    // Show loader
    // $("#loaderModal").removeClass("hidden");
    showDivLoader("right_page_banner");
    $.ajax({
        url: window.BASEURL + "/api/promotions",
        type: "POST",
        data: params,
        dataType: "json",
        success: function (response) {
            if (!response.success || !response.data.length) {
                $("#right_page_banner").html(
                    "<p class='text-center text-gray-500 py-8'>No promotions found.</p>"
                );
                return;
            }

            let html = '';

            $.each(response.data, function (index, promo) {
                const promoUrl = promo.url ?? '#';
                const imgSrc = promo.image ? window.BASEURL + `/ad/${promo.image}` : '';
                html += `
                        <a href="${promoUrl}" target="_blank"
                            class="block group bg-white dark:bg-darkCard rounded-md shadow-md border-2 border-gray-600 dark:border-gray-700  hover:border-accent transition-shadow duration-300 ease-in-out overflow-hidden flex-shrink-0 w-11/12 sm:w-3/4 md:w-auto snap-center first:ml-6 last:mr-6 md:first:ml-0 md:last:mr-0">
                            <img src="${imgSrc}" alt="${promo.alt ?? 'Promotion'}"
                                class="transition-transform duration-300 group-hover:scale-105 w-full object-cover">
                        </a>
                    `;
            });

            $("#right_page_banner").html(html);
        },
        error: function () {
            $("#right_page_banner").html(
                "<p class='text-center text-red-500 py-8'>Failed to load promotions.</p>"
            );
        },
        complete: function () {
            // Hide loader
            $("#loaderModal").addClass("hidden");
        }
    });
}


function fetch_home_featured_promotions(page = 1, params = {}) {
    params['page'] = page;
    showDivLoader("home-featured-conferences-section");
    $.ajax({
        url: window.BASEURL + "/api/promotions",
        type: "POST",
        data: params,
        dataType: "json",
        success: function (response) {
            if (!response.success || !response.data.length) {
                $("#home-featured-conferences-section").html(
                    "<p class='text-center text-gray-500 py-8'>No promotions found.</p>"
                );
                return;
            }

            let html = '';
            $.each(response.data, function (index, promo) {
                const imgSrc = promo.banner ? window.BASEURL + "/logo_ad/" + promo.banner : '';
                const eventDate = promo.event_stat
                    ? new Date(promo.event_stat).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                    })
                    : 'Date TBA';

                const location = `${promo.city || ''}${promo.city && promo.country ? ', ' : ''}${promo.country?.split('#')[1] || ''}`;
                const topic = promo.event_topic?.split('###')[2] || 'General';

                var postUrl = window.BASEURL+"/event/" + (promo.event_id ?? '#');

                html += `
                <article  class="conference-card group bg-white dark:bg-darkCard rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden" style="width: 360px; flex-shrink: 0;">
                    <div class="p-6 flex flex-col flex-grow">
                        <!-- Logo Area -->
                        <div class="mb-4 h-32 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg overflow-hidden">
                            <img src="${imgSrc}" alt="${promo.alt ?? promo.event_name}" class="w-full h-full object-contain">
                        </div>

                        <!-- Heading -->
                        <span id="conf-title-${index + 1}" class="text-lg font-bold text-primary dark:text-white mb-4 flex-grow min-h-[84px]">
                            ${promo.event_name}
                        </span>

                        <!-- Date and Location Tags -->
                        <div class="flex flex-col items-start gap-2 mb-6">
                            <span class="inline-flex items-center gap-2 rounded-md bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-sm font-medium text-gray-800 dark:text-gray-300">
                                <i class="far fa-calendar-alt w-4 text-gray-500"></i>
                                <span>${eventDate}</span>
                            </span>
                            <span class="inline-flex items-center gap-2 rounded-md bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-sm font-medium text-gray-800 dark:text-gray-300">
                                <i class="fas fa-map-marker-alt w-4 text-gray-500"></i>
                                <span>${location || 'Online / TBA'}</span>
                            </span>
                        </div>

                        <!-- Footer -->
                        <div class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">${topic}</span>
                            <div class="flex items-center space-x-2">
                                <button aria-label="Save conference" id="${promo.event_id}" onClick="javascript:saveEventEmail('${postUrl}','${promo.event_id}')"   title="Save conference" class="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <i class="fas fa-bookmark"></i>
                                </button>
                                <button onClick="openShareModal('${postUrl}')" aria-label="Share conference" title="Share conference" class="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <i class="fas fa-share-nodes"></i>
                                </button>
                                <a href="${postUrl}" class="px-4 py-2 text-sm font-semibold text-white bg-primary dark:bg-gray-600 rounded-lg hover:bg-opacity-80 transition-colors duration-200" target="_blank" rel="noopener noreferrer">Details</a>
                            </div>
                        </div>
                    </div>
                </article>`;
            });

           $("#home-featured-conferences-section").html(html);
        },
        error: function () {
            $("#home-featured-conferences-section").html(
                "<p class='text-center text-red-500 py-8'>Failed to load promotions.</p>"
            );
        },
        complete: function () {
            $("#loaderModal").addClass("hidden");
        }
    });
}


function fetch_left_textpromotions(page = 1, params = {}) {
    params['page'] = page;
    params['ad_type'] = 'FEATURED';

    // Simple spinner loader
    showDivLoader("featured-events-scroller");


    $.ajax({
        url: window.BASEURL + "/api/promotions",
        type: "POST",
        data: params,
        dataType: "json",
        success: function (response) {
            if (!response.success || !response.data.length) {
                $("#featured-events-scroller").html(
                    "<p class='text-center text-gray-500 py-8'>No promotions found.</p>"
                );
                return;
            }

            let html = '';
            $.each(response.data, function (index, promo) {
                // const postUrl = promo.web_url ?? "#";
                                const postUrl = window.BASEURL + "/event/"+promo.event_id;

                const eventName = promo.event_name ?? "Untitled Event";
                const rawDate = promo.event_stat;
                const formattedDate = rawDate
                    ? new Date(rawDate).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                    })
                    : "Date TBA";

                const country = promo.country?.split("#")[1] || "";
                const city = promo.city || "";
                const location = city && country ? `${city}, ${country}` : (city || country || 'Location TBA');

                html += `
                    <a href="${postUrl}" target="_blank" rel="noopener noreferrer"
                        class="block w-full bg-white dark:bg-slate-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary dark:border-gray-600 dark:hover:border-white transition-all duration-300 group">
                        <h4 class="font-bold text-primary dark:text-white mb-3 h-auto transition-colors">
                            ${eventName}
                        </h4>
                        <div class="space-y-2 text-sm">
                            <p class="flex items-center text-gray-600 dark:text-gray-400 transition-colors group-hover:text-gray-800 dark:group-hover:text-gray-100">
                                <i class="fas fa-calendar-alt w-4 mr-2 text-gray-400"></i>
                                ${formattedDate}
                            </p>
                            <p class="flex items-center text-gray-600 dark:text-gray-400 transition-colors group-hover:text-gray-800 dark:group-hover:text-gray-100">
                                <i class="fas fa-map-marker-alt w-4 mr-2 text-gray-400"></i>
                                ${location}
                            </p>
                        </div>
                    </a>
                `;
            });

            $("#featured-events-scroller").html(html);
        },
        error: function () {
            $("#featured-events-scroller").html(
                "<p class='text-center text-red-500 py-8'>Failed to load promotions.</p>"
            );
        }
    });
}


function fetch_textpromotions_event_Details(page = 1, params = {}) {
    params['page'] = page;
    params['ad_type'] = 'FEATURED';

    // Simple spinner loader
   showDivLoader("featured-events-details");


    $.ajax({
        url: window.BASEURL + "/api/promotions",
        type: "POST",
        data: params,
        dataType: "json",
        success: function (response) {
            if (!response.success || !response.data.length) {
                $("#featured-events-details").html(
                    "<p class='text-center text-gray-500 py-8'>No promotions found.</p>"
                );
                return;
            }

            let html = '';
            $.each(response.data, function (index, promo) {
                // const postUrl = promo.web_url ?? "#";
                const postUrl = window.BASEURL + "/event/"+promo.event_id;

                const eventName = promo.event_name ?? "Untitled Event";
                const rawDate = promo.event_stat;
                const formattedDate = rawDate
                    ? new Date(rawDate).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                    })
                    : "Date TBA";

                const country = promo.country?.split("#")[1] || "";
                const city = promo.city || "";
                const location = city && country ? `${city}, ${country}` : (city || country || 'Location TBA');

                html += `
                    <a href="${postUrl}" target="_blank" rel="noopener noreferrer"
                        class="mb-5 block w-full bg-white dark:bg-slate-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary dark:border-gray-600 dark:hover:border-white transition-all duration-300 group">
                        <h4 class="font-bold text-primary dark:text-white mb-3 h-auto transition-colors">
                            ${eventName}
                        </h4>
                        <div class="space-y-2 text-sm">
                            <p class="flex items-center text-gray-600 dark:text-gray-400 transition-colors group-hover:text-gray-800 dark:group-hover:text-gray-100">
                                <i class="fas fa-calendar-alt w-4 mr-2 text-gray-400"></i>
                                ${formattedDate}
                            </p>
                            <p class="flex items-center text-gray-600 dark:text-gray-400 transition-colors group-hover:text-gray-800 dark:group-hover:text-gray-100">
                                <i class="fas fa-map-marker-alt w-4 mr-2 text-gray-400"></i>
                                ${location}
                            </p>
                        </div>
                    </a>
                    
                `;
            });

            $("#featured-events-details").html(html);
        },
        error: function () {
            $("#featured-events-details").html(
                "<p class='text-center text-red-500 py-8'>Failed to load promotions.</p>"
            );
        }
    });
}



function showDivLoader(divID) {
    $("#" + divID).html(`
         <div id="loading-spinner-home-featured" class="w-full col-span-full flex justify-center items-center h-full min-h-[200px]">
            <div class="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    `);
}


function setupSlider() {
    const slider = document.getElementById('conf-slider');
    const viewport = document.getElementById('conf-slider-viewport');
    const track = document.getElementById('home-featured-conferences-section');
    const prevBtn = document.getElementById('conf-prev-btn');
    const nextBtn = document.getElementById('conf-next-btn');

    if (!slider || !track || !viewport) return;

    let currentIndex = 0;
    let isTransitioning = false;
    let autoplayInterval;
    const TRANSITION_DURATION_MS = 500;
    const AUTOPLAY_INTERVAL_MS = 3000;
    let slidesPerView = 0;
    let gap = 0;

    let originalSlides = Array.from(track.children);

    function getSlidesPerView() {
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function updateTrackPosition(animate = true) {
        track.style.transition = animate ? `transform ${TRANSITION_DURATION_MS}ms ease-in-out` : 'none';
        const slideWidth = track.children[0].offsetWidth;
        const totalOffset = currentIndex * (slideWidth + gap);
        track.style.transform = `translateX(-${totalOffset}px)`;
    }

    function moveNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updateTrackPosition();

        if (currentIndex >= originalSlides.length + slidesPerView) {
            setTimeout(() => {
                currentIndex = slidesPerView;
                updateTrackPosition(false);
            }, TRANSITION_DURATION_MS);
        }
        setTimeout(() => isTransitioning = false, TRANSITION_DURATION_MS);
    }

    function movePrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        updateTrackPosition();

        if (currentIndex < slidesPerView) {
            setTimeout(() => {
                currentIndex = originalSlides.length + slidesPerView - 1;
                updateTrackPosition(false);
            }, TRANSITION_DURATION_MS);
        }
        setTimeout(() => isTransitioning = false, TRANSITION_DURATION_MS);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(moveNext, AUTOPLAY_INTERVAL_MS);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function initializeSlider() {
        slidesPerView = getSlidesPerView();

        originalSlides = Array.from(track.children);

        if (originalSlides.length <= slidesPerView) {
            track.style.display = 'grid';
            track.style.gridTemplateColumns = `repeat(${slidesPerView}, 1fr)`;
            track.innerHTML = '';
            track.append(...originalSlides);
            track.style.transform = 'none';
            prevBtn.classList.add('hidden');
            nextBtn.classList.add('hidden');
            return;
        }

        track.innerHTML = '';
        const clonesStart = originalSlides.slice(-slidesPerView).map(el => el.cloneNode(true));
        const clonesEnd = originalSlides.slice(0, slidesPerView).map(el => el.cloneNode(true));
        track.append(...clonesStart, ...originalSlides, ...clonesEnd);
        track.style.display = 'flex';

        gap = parseInt(window.getComputedStyle(track).gap) || 32;
        const viewportWidth = viewport.clientWidth;
        const slideWidth = (viewportWidth - (gap * (slidesPerView - 1))) / slidesPerView;

        Array.from(track.children).forEach(slide => {
            slide.style.width = `${slideWidth}px`;
            slide.style.flexShrink = '0';
        });

        currentIndex = slidesPerView;
        updateTrackPosition(false);

        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
        startAutoplay();
    }

    // Responsive recalculations
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initializeSlider, 300);
    });

    nextBtn.addEventListener('click', moveNext);
    prevBtn.addEventListener('click', movePrev);
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    initializeSlider();

}

