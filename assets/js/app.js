(function() {
    "use strict"

    const body = document.querySelector('body');

    // Transition effect
    let transition = function(e) {
        let href = this.getAttribute('href');
        let target = this.getAttribute('target');
        if (!href || href.indexOf('#') != -1 || href.indexOf('tel') != -1 || href.indexOf('wa.me') != -1 || href.indexOf('mailto') != -1 || target == '_blank')
            return;
        e.preventDefault();
        e.stopPropagation();
        body.classList.add('transition');
        window.setTimeout(function() {
            window.location.href = href;
        }, 50);
    }
    
    body.addEventListener('click', function(e) {
        for (let target = e.target; target && target != this; target = target.parentNode) {
            if (target.matches('a')) {
                transition.call(target, e);
                break;
            }
        }
    }, false);

    // Remove transition if page loaded from bfcache
    window.addEventListener('pageshow', function(event) {
        if (event.persisted === true) {
            body.classList.remove('transition');
        }
    }, false);

    // Carousel
    function Carousel() {
        const carouselEl = document.querySelector(".carousel");
        const slideContainerEl = carouselEl.querySelector(".slider");
        const slideEl = carouselEl.querySelector(".slide");
        let slideWidth = slideEl.offsetWidth;
        // Add click handlers
        document.querySelector("#button_bck")
            .addEventListener("click", () => navigate("backward"));
        document.querySelector("#button_fwd")
            .addEventListener("click", () => navigate("forward"));
        
        // Add keyboard handlers
        document.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft') {
                navigate("backward");
            } else if (e.code === 'ArrowRight') {
                navigate("forward");
            }
        });
        // Add resize handler
        window.addEventListener('resize', () => {
            slideWidth = slideEl.offsetWidth;
        });

        function changeSlideWidth() {
            slideWidth = slideEl.offsetWidth;
        }

        const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
        if (!touch) {
            new ResizeObserver(changeSlideWidth).observe(carouselEl);

            slideContainerEl.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                carouselEl.classList.toggle('big');
            });
        }

        // Slide transition
        const getNewScrollPosition = (arg) => {
            const maxScrollLeft = slideContainerEl.scrollWidth - slideWidth;
            if (arg === "forward") {
                const x = slideContainerEl.scrollLeft + slideWidth;
                return x <= maxScrollLeft ? x : 0;
            } else if (arg === "backward") {
                const x = slideContainerEl.scrollLeft - slideWidth;
                return x >= 0 ? x : maxScrollLeft;
            } else if (typeof arg === "number") {
                const x = arg * (slideWidth);
                return x;
            }
        }
        const navigate = (arg) => {
            slideContainerEl.scrollLeft = getNewScrollPosition(arg);
        }

    }
    
    // Loading animation
    window.addEventListener('load', function() {
        body.classList.remove('is-loading');
        body.classList.remove('transition');
        if (document.querySelector(".carousel")) {
            Carousel();
        }
    });

    // Popups open
    const areaAll = document.querySelectorAll('.area');
    for (const area of areaAll) {
        area.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            const popup_id = this.dataset.popup;
            const popupEl = document.getElementById(popup_id);
            if (popupEl) {
                popupEl.classList.remove("hide");
                popupEl.classList.add("fade-in");
            }
            const overlayEl = document.querySelector('.global_overlay');
            if (overlayEl) {
                overlayEl.classList.remove("hide");
                overlayEl.classList.add("fade-in");
            }
        })
    }

    // Popups close
    const popupCloseAll = document.querySelectorAll('.popup_close');
    for (const popupClose of popupCloseAll) {
        popupClose.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            const popup_id_string = this.dataset.popup;
            const popup_id_array = popup_id_string.split(' ');
            for (const popup_id of popup_id_array) {
                const popupEl = document.getElementById(popup_id);
                if (popupEl) {
                    popupEl.classList.remove("fade-in");
                    popupEl.classList.add("fade-out");
                    window.setTimeout(function() {
                        popupEl.classList.add("hide");
                        popupEl.classList.remove("fade-out");
                    }, 450, popupEl);
                }
            }
            const overlayEl = document.querySelector('.global_overlay');
            if (overlayEl) {
                overlayEl.classList.remove("fade-in");
                overlayEl.classList.add("fade-out");
                window.setTimeout(function() {
                    overlayEl.classList.add("hide");
                    overlayEl.classList.remove("fade-out");
                }, 450, overlayEl);
            }
        })
    }

})();