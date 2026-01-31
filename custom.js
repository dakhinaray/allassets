
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.getElementById('main-nav');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    let lastScrollTop = 0;

    // --- PERFECTED Scroll Logic ---
    window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Do not hide navbar if mobile menu is open
        if (mobileMenu.classList.contains('hidden')) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                nav.classList.add('nav-hidden'); // Scrolling Down
            } else {
                nav.classList.remove('nav-hidden'); // Scrolling Up
            }
        }

        // Handle background change
        if (scrollTop > 50) {
            nav.style.backgroundColor = 'rgba(17, 36, 50, 0.85)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.backgroundColor = 'transparent';
            nav.style.backdropFilter = 'none';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // --- PERFECTED Mobile Menu Logic ---
    mobileMenuButton.addEventListener('click', () => {
        const isMenuOpen = mobileMenu.classList.toggle('hidden');

        if (!isMenuOpen) { // Menu is now open
            nav.classList.add('mobile-menu-open'); // Force background style
            nav.classList.remove('nav-hidden'); // Ensure it's visible
        } else { // Menu is now closed
            nav.classList.remove('mobile-menu-open');
            // Re-evaluate background based on current scroll
            if (window.pageYOffset <= 50) {
                nav.style.backgroundColor = 'transparent';
                nav.style.backdropFilter = 'none';
            }
        }
    });

    // All other scripts
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => {
                btn.classList.remove('active-tab', 'text-white', 'border-accent');
                btn.classList.add('text-white/60');
            });
            button.classList.add('active-tab', 'text-white', 'border-accent');
            tabPanels.forEach(panel => panel.classList.add('hidden'));
            document.querySelector(button.dataset.tabTarget).classList.remove('hidden');
        });
    });
});

const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Deactivate all buttons
        tabButtons.forEach(btn => {
            btn.classList.remove('active-tab');
            btn.classList.add('text-white/70'); // Make inactive tabs semi-transparent
            btn.setAttribute('aria-selected', 'false');
        });

        // Activate the clicked button
        button.classList.add('active-tab');
        button.classList.remove('text-white/70');
        button.setAttribute('aria-selected', 'true');

        // Hide all panels
        tabPanels.forEach(panel => panel.classList.add('hidden'));

        // Show the target panel
        const targetPanel = document.querySelector(button.dataset.tabTarget);
        if (targetPanel) {
            targetPanel.classList.remove('hidden');
        }
    });
});

// New script for sidebar tabs
document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all buttons and hide all panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.add('hidden'));

            // Activate the clicked button
            button.classList.add('active');

            // Show the target panel
            const targetPanel = document.querySelector(button.dataset.tabTarget);
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
            }
        });
    });



    // --- SCRIPT 2: PERFECTED SCROLLING CALENDAR ---
    const scrollContainer = document.getElementById("scrollContainer");
    const scrollLeftBtn = document.getElementById("scrollLeft");
    const scrollRightBtn = document.getElementById("scrollRight");

    // Check if all scroll elements exist before adding listeners
    if (scrollContainer && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener("click", () => {
            // Scroll left by a fixed amount
            scrollContainer.scrollBy({ left: -300, behavior: "smooth" });
        });

        scrollRightBtn.addEventListener("click", () => {
            // Scroll right by a fixed amount
            scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
        });
    }



});

















document.addEventListener('DOMContentLoaded', function () {

    const btn = document.getElementById('checkLoginBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        try {
            const currentUrl = window.location.href;
            const response = await fetch(window.BASEURL + '/check-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                credentials: 'include',
                body: JSON.stringify({ redirect_url: currentUrl })
            });

            const data = await response.json();

            if (!data.logged_in) {
                // Not logged in → redirect to login
                window.location.href = window.BASEURL + '/login.html';
                return;
            }

            alert(data.message); // Logged in → mail sent

        } catch (err) {
            console.error(err);
            alert('Something went wrong!');
        }
    });

});



async function saveEventEmail(redirect_url = null, eventId = 0, continent='', country ='', state = '', city = '', topic = '') {
    const modal = $("#loginSaveModal");
    const box = $("#loginSaveModalBox");
    const loader = $("#loginSaveModalLoader");
    const content = $("#loginSaveModalContent");
    const successMessageDiv = $("#loginSaveSuccess");
    const successMessageElement = $("#successMessage");

    // Show modal with animation
    modal.removeClass("hidden").addClass("flex");
    setTimeout(() => box.addClass("opacity-100 scale-100").removeClass("opacity-0 scale-95"), 10);

    loader.removeClass("hidden");
    content.addClass("hidden");
    successMessageDiv.addClass("hidden");

    try {
        const response = await fetch(window.BASEURL + '/check-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            credentials: 'include',
            body: JSON.stringify({
                redirect_url: redirect_url ?? window.location.href,
                event_id: eventId,
                continent: continent,
                country: country,
                state: state,
                city: city,
                topic: topic,
            })
        });

        const data = await response.json();
        loader.addClass("hidden");
        content.removeClass("hidden");

        if (!data.logged_in) {
            // Show modal actions
            $("#proceedLogin").off("click").on("click", function () {
                window.location.href = window.BASEURL + '/login.html';
            });
            $("#cancelLogin, #closeloginSaveModal").off("click").on("click", function () {
                closeloginSaveModal();
            });
            return;
        }

        // Show success message in the modal
        successMessageElement.text(data.message || "Event saved successfully!");
        content.addClass("hidden");
        successMessageDiv.removeClass("hidden");

        // Close success message after some time or show the close button
        $("#closeSuccess").off("click").on("click", function () {
            closeloginSaveModal();
        });

        $("#cancelLogin, #closeloginSaveModal").off("click").on("click", function () {
            closeloginSaveModal();
        });
    } catch (err) {
        console.error(err);
        closeloginSaveModal();
        alert("Something went wrong!");
    }
}


function closeloginSaveModal() {
    const modal = $("#loginSaveModal");
    const box = $("#loginSaveModalBox");

    box.addClass("opacity-0 scale-95").removeClass("opacity-100 scale-100");
    setTimeout(() => modal.addClass("hidden").removeClass("flex"), 200);
}


// SHARE MODAL SCRIPT



function openShareModal(eventUrl) {
        const modal = $("#shareModal");
        const box = $("#shareModalBox");
        const input = $("#shareEventUrl");

        console.log("Opening Share Modal with URL:", eventUrl);

        // Set share URL
        input.val(eventUrl);

        // Update social media links
        $("#shareFacebook").attr("href", `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`);
        $("#shareTwitter").attr("href", `https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}`);
        $("#shareLinkedIn").attr("href", `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(eventUrl)}`);
        $("#shareWhatsApp").attr("href", `https://api.whatsapp.com/send?text=${encodeURIComponent(eventUrl)}`);
        $("#shareTelegram").attr("href", `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}`);

        // Show modal with animation
        modal.removeClass("hidden").addClass("flex");
        setTimeout(() => box.addClass("opacity-100 scale-100").removeClass("opacity-0 scale-95"), 10);
    }




$(document).ready(function () {
    
    // Bind the close button event to hide the modal
    $("#closeShareModal").on("click", function () {
        closeShareModal();
    });

    // Define the function to close the modal
    function closeShareModal() {
        console.log("Closing Share Modal...");
        // Apply closing animations
        $("#shareModalBox").addClass("opacity-0 scale-95").removeClass("opacity-100 scale-100");

        // After the animation ends, hide the modal
        setTimeout(function () {
            $("#shareModal").addClass("hidden").removeClass("flex");
            console.log("Modal hidden");
        }, 200);  // Timeout duration should match the animation duration
    }





    // Copy share URL function
    $("#copyShareUrl").on("click", function () {
        const input = document.getElementById("shareEventUrl");
        input.select();
        input.setSelectionRange(0, 99999);  // For mobile devices
        document.execCommand("copy");
        $(this).text("Copied!");
        setTimeout(() => $(this).text("Copy"), 2000);
    });

    // Open Share Modal Function (Example of how to trigger the modal)
    // Open Share Modal function
});

// END SHARE MODAL SCRIPT





// document.addEventListener("DOMContentLoaded", function () {
//   const modal = document.getElementById("statusModal");
//   const loader = document.getElementById("statusLoader");
//   const successBox = document.getElementById("statusSuccess");
//   const errorBox = document.getElementById("statusError");
//   const successMsg = document.getElementById("statusSuccessMsg");
//   const errorMsg = document.getElementById("statusErrorMsg");

//   const closeBtns = [
//     document.getElementById("closeStatusModal"),
//     document.getElementById("closeStatusSuccessBtn"),
//     document.getElementById("closeStatusErrorBtn")
//   ];

//   // Universal modal controller
//   function showStatusModal(type = "loading", message = "") {
//     modal.classList.remove("hidden");
//     loader.classList.add("hidden");
//     successBox.classList.add("hidden");
//     errorBox.classList.add("hidden");

//     if (type === "loading") {
//       loader.classList.remove("hidden");
//     } else if (type === "success") {
//       successBox.classList.remove("hidden");
//       if (message) successMsg.textContent = message;
//     } else if (type === "error") {
//       errorBox.classList.remove("hidden");
//       if (message) errorMsg.textContent = message;
//     }
//   }

//   function hideStatusModal() {
//     modal.classList.add("hidden");
//     loader.classList.add("hidden");
//     successBox.classList.add("hidden");
//     errorBox.classList.add("hidden");
//   }

//   // Attach close handlers
//   closeBtns.forEach(btn => {
//     if (btn) btn.addEventListener("click", hideStatusModal);
//   });

//   // Expose globally (so you can call from anywhere)
//   window.showStatusModal = showStatusModal;
//   window.hideStatusModal = hideStatusModal;
// });



document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("statusModal");
  const loader = document.getElementById("statusLoader");
  const successBox = document.getElementById("statusSuccess");
  const errorBox = document.getElementById("statusError");
  const successMsg = document.getElementById("statusSuccessMsg");
  const errorMsg = document.getElementById("statusErrorMsg");

  const closeBtns = [
    document.getElementById("closeStatusModal"),
    document.getElementById("closeStatusSuccessBtn"),
    document.getElementById("closeStatusErrorBtn")
  ];

  // Universal modal controller
  function showStatusModal(type = "loading", message = "") {
    modal.classList.remove("hidden");
    loader.classList.add("hidden");
    successBox.classList.add("hidden");
    errorBox.classList.add("hidden");

    if (type === "loading") {
      loader.classList.remove("hidden");
    } else if (type === "success") {
      successBox.classList.remove("hidden");
      if (message) successMsg.textContent = message;
    } else if (type === "error") {
      errorBox.classList.remove("hidden");
      if (message) errorMsg.textContent = message;
    }
  }

  function hideStatusModal() {
    modal.classList.add("hidden");
    loader.classList.add("hidden");
    successBox.classList.add("hidden");
    errorBox.classList.add("hidden");
  }

  // Attach close handlers
  closeBtns.forEach(btn => {
    if (btn) btn.addEventListener("click", hideStatusModal);
  });

  // ===== NEW: Login modal helper =====
  function showLoginModalContent() {
    const loginBox = document.getElementById("loginSaveModalContentCommon");
    if (!loginBox) return;

    // Show main modal
    modal.classList.remove("hidden");

    // Show login content
    loginBox.classList.remove("hidden");

    // Hide other modal sections
    loader.classList.add("hidden");
    successBox.classList.add("hidden");
    errorBox.classList.add("hidden");

    // Bind buttons dynamically
    const proceedBtn = document.getElementById("proceedLoginCommon");
    if (proceedBtn) {
      proceedBtn.onclick = () => {
        window.location.href = window.BASEURL + '/login.html';
      };
    }

    const cancelBtn = document.getElementById("cancelLoginCommon");
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        hideStatusModal();          // reuse existing function
        loginBox.classList.add("hidden"); // hide login content
      };
    }
  }

  // Expose globally
  window.showStatusModal = showStatusModal;
  window.hideStatusModal = hideStatusModal;
  window.showLoginModalContent = showLoginModalContent;
});
