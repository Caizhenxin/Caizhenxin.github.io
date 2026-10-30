(function () {
  'use strict';

  function init() {
    var cards = document.querySelectorAll('.topic-card');
    if (!cards.length) return;

    var hoverNone = window.matchMedia && window.matchMedia('(hover: none)').matches;
    var CLOSE_DELAY = 200;

    Array.prototype.forEach.call(cards, function (card) {
      var drawer = card.querySelector('.topic-drawer');
      var closeTimer = null;
      var isOpen = false;

      function open() {
        if (isOpen) return;
        isOpen = true;
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        card.classList.add('is-open');
        card.setAttribute('aria-expanded', 'true');
        if (drawer) drawer.setAttribute('aria-hidden', 'false');
      }

      function close() {
        if (!isOpen) return;
        isOpen = false;
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        card.classList.remove('is-open');
        card.setAttribute('aria-expanded', 'false');
        if (drawer) drawer.setAttribute('aria-hidden', 'true');
      }

      function scheduleClose() {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(function () {
          if (card.contains(document.activeElement)) return;
          close();
        }, CLOSE_DELAY);
      }

      if (!hoverNone) {
        card.addEventListener('mouseenter', open);
        card.addEventListener('mouseleave', scheduleClose);
      }

      card.addEventListener('focusin', open);
      card.addEventListener('focusout', function () {
        setTimeout(function () {
          if (!card.contains(document.activeElement)) close();
        }, 0);
      });

      card.addEventListener('click', function (e) {
        if (hoverNone && !isOpen) {
          e.preventDefault();
          open();
        }
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
          close();
          card.focus();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
