(function() {
    "use strict"

    const body = document.querySelector('body');

    // Loading animation
    window.addEventListener('load', function() {
        body.classList.remove('is-loading');
        body.classList.remove('transition');
    });

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
        }, 150);
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

})();