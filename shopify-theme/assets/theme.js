/* theme.js — The 00s Version Shopify theme */

(function () {
  'use strict';

  /* ─── Helpers ─────────────────────────────────────────────────────────── */
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function formatMoney(cents) {
    return '€' + (cents / 100).toFixed(2);
  }

  /* ─── Mobile menu ─────────────────────────────────────────────────────── */
  var menuToggle = qs('#mobile-menu-toggle');
  var mobileMenu = qs('#mobile-menu');
  var hamburgerIcon = qs('.hamburger-icon');
  var closeIcon = qs('.close-icon');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var isOpen = !mobileMenu.hidden;
      mobileMenu.hidden = isOpen;
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      if (hamburgerIcon) hamburgerIcon.style.display = isOpen ? '' : 'none';
      if (closeIcon) closeIcon.style.display = isOpen ? 'none' : '';
    });
  }

  /* ─── Search overlay ──────────────────────────────────────────────────── */
  var searchOverlay = qs('#search-overlay');
  var searchInput = qs('#search-input');
  var searchResults = qs('#search-results');
  var searchSuggestions = qs('#search-suggestions');
  var searchDebounce;

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () { if (searchInput) searchInput.focus(); }, 50);
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.hidden = true;
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
    if (searchSuggestions) searchSuggestions.style.display = '';
  }

  qsa('#search-open, #search-open-mobile').forEach(function (btn) {
    btn.addEventListener('click', openSearch);
  });

  var searchClose = qs('#search-close');
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSearch();
      closeCart();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(searchDebounce);
      var q = searchInput.value.trim();
      if (!q) {
        if (searchResults) searchResults.innerHTML = '';
        if (searchSuggestions) searchSuggestions.style.display = '';
        return;
      }
      if (searchSuggestions) searchSuggestions.style.display = 'none';
      searchDebounce = setTimeout(function () { fetchSearchResults(q); }, 280);
    });
  }

  function fetchSearchResults(q) {
    fetch('/search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product&resources[limit]=6')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var products = (data.resources && data.resources.results && data.resources.results.products) || [];
        renderSearchResults(products);
      })
      .catch(function () {
        if (searchResults) searchResults.innerHTML = '';
      });
  }

  function renderSearchResults(products) {
    if (!searchResults) return;
    if (!products.length) {
      searchResults.innerHTML = '<p style="font-family:Arial,sans-serif;font-size:0.8rem;color:#525252;padding:1rem 0;">No products found.</p>';
      return;
    }
    searchResults.innerHTML = products.map(function (p) {
      var img = p.featured_image
        ? '<img class="search-result-img" src="' + p.featured_image.url + '" alt="' + escHtml(p.title) + '">'
        : '<div class="search-result-img" style="background:#111;border-radius:3px;display:flex;align-items:center;justify-content:center;"><span style="font-size:0.6rem;color:#333;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">No img</span></div>';
      return '<a href="' + p.url + '" class="search-result-item">'
        + img
        + '<span class="search-result-name">' + escHtml(p.title) + '</span>'
        + '<span class="search-result-price">' + formatMoney(p.price) + '</span>'
        + '</a>';
    }).join('');
  }

  function escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ─── Cart drawer ─────────────────────────────────────────────────────── */
  var cartDrawer = qs('#cart-drawer');
  var cartOverlay = qs('#cart-overlay');
  var cartDrawerItems = qs('#cart-drawer-items');
  var cartDrawerFooter = qs('#cart-drawer-footer');
  var cartEmpty = qs('#cart-empty');
  var cartSubtotal = qs('#cart-subtotal');
  var cartCountBadge = qs('#cart-count-badge');

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    fetchCart();
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  qsa('#cart-open, #cart-open-mobile').forEach(function (btn) {
    btn.addEventListener('click', openCart);
  });

  var cartClose = qs('#cart-close');
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function fetchCart() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) { renderCart(cart); })
      .catch(function () {});
  }

  function renderCart(cart) {
    updateCartCount(cart.item_count);

    if (!cart.item_count) {
      if (cartDrawerItems) cartDrawerItems.innerHTML = '';
      if (cartDrawerFooter) cartDrawerFooter.hidden = true;
      if (cartEmpty) cartEmpty.removeAttribute('hidden');
      return;
    }

    if (cartEmpty) cartEmpty.setAttribute('hidden', '');
    if (cartDrawerFooter) cartDrawerFooter.removeAttribute('hidden');
    if (cartSubtotal) cartSubtotal.textContent = formatMoney(cart.total_price);

    if (cartDrawerItems) {
      cartDrawerItems.innerHTML = cart.items.map(function (item) {
        var img = item.image
          ? '<img class="cart-item-img" src="' + item.image + '" alt="' + escHtml(item.product_title) + '">'
          : '<div class="cart-item-img" style="background:#111;display:flex;align-items:center;justify-content:center;"><span style="font-size:0.6rem;color:#333;text-transform:uppercase;letter-spacing:0.1em;">No img</span></div>';
        return '<div class="cart-item" data-key="' + item.key + '">'
          + img
          + '<div class="cart-item-info">'
          + '<p class="cart-item-type">' + escHtml(item.product_type || '') + '</p>'
          + '<p class="cart-item-name">' + escHtml(item.product_title) + '</p>'
          + (item.variant_title ? '<p class="cart-item-variant">' + escHtml(item.variant_title) + '</p>' : '')
          + '<div class="cart-item-bottom">'
          + '<div class="cart-item-qty">'
          + '<button type="button" onclick="window.cartQty(this,-1)" aria-label="Decrease quantity">&#8722;</button>'
          + '<span>' + item.quantity + '</span>'
          + '<button type="button" onclick="window.cartQty(this,1)" aria-label="Increase quantity">&#43;</button>'
          + '</div>'
          + '<span class="cart-item-price">' + formatMoney(item.line_price) + '</span>'
          + '</div>'
          + '<button class="cart-item-remove" onclick="window.cartRemove(this)" aria-label="Remove item">Remove</button>'
          + '</div>'
          + '</div>';
      }).join('');
    }
  }

  window.cartQty = function (btn, delta) {
    var item = btn.closest('.cart-item');
    var key = item && item.dataset.key;
    if (!key) return;
    var qtyEl = item.querySelector('.cart-item-qty span');
    var current = parseInt(qtyEl ? qtyEl.textContent : '1', 10);
    var next = Math.max(0, current + delta);
    cartUpdate(key, next);
  };

  window.cartRemove = function (btn) {
    var item = btn.closest('.cart-item');
    var key = item && item.dataset.key;
    if (!key) return;
    cartUpdate(key, 0);
  };

  function cartUpdate(key, qty) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty }),
    })
      .then(function (r) { return r.json(); })
      .then(function (cart) { renderCart(cart); })
      .catch(function () {});
  }

  function updateCartCount(n) {
    var counts = qsa('#cart-count, #cart-count-mobile');
    counts.forEach(function (el) {
      if (n > 0) {
        el.textContent = n > 99 ? '99+' : n;
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
    if (cartCountBadge) {
      cartCountBadge.textContent = n > 0 ? String(n > 99 ? '99+' : n) : '';
    }
  }

  /* Handle add-to-cart form — open drawer after adding */
  var productForm = qs('#product-form');
  if (productForm) {
    productForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var variantId = qs('#variant-id');
      var qty = qs('#quantity-input');
      if (!variantId) return;

      var body = {
        id: variantId.value,
        quantity: qty ? parseInt(qty.value, 10) || 1 : 1,
      };

      var btn = productForm.querySelector('[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Adding...';
      }

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then(function (r) {
          if (!r.ok) throw new Error('Add to cart failed');
          return r.json();
        })
        .then(function () {
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Added!';
            setTimeout(function () { btn.textContent = 'Add to Cart'; }, 2000);
          }
          openCart();
        })
        .catch(function () {
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Add to Cart';
          }
        });
    });
  }

  /* Initialise cart count on page load */
  fetch('/cart.js')
    .then(function (r) { return r.json(); })
    .then(function (cart) { updateCartCount(cart.item_count); })
    .catch(function () {});

  /* ─── Cookie banner ───────────────────────────────────────────────────── */
  var cookieBanner = qs('#cookie-banner');
  var cookieAccept = qs('#cookie-accept');
  var cookieDecline = qs('#cookie-decline');
  var COOKIE_KEY = 'cookie_consent_00s';

  if (cookieBanner && !localStorage.getItem(COOKIE_KEY)) {
    cookieBanner.hidden = false;
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'accepted');
      if (cookieBanner) cookieBanner.hidden = true;
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'declined');
      if (cookieBanner) cookieBanner.hidden = true;
    });
  }

  /* ─── Sticky shop button ──────────────────────────────────────────────── */
  var stickyBtn = qs('#sticky-shop-btn');

  if (stickyBtn) {
    var heroEl = qs('#hero');
    function updateStickyBtn() {
      if (!heroEl) {
        stickyBtn.hidden = window.scrollY < 200;
        return;
      }
      var heroBottom = heroEl.getBoundingClientRect().bottom;
      stickyBtn.hidden = heroBottom > 0;
    }
    window.addEventListener('scroll', updateStickyBtn, { passive: true });
    updateStickyBtn();
  }

  /* ─── Cycling era text ────────────────────────────────────────────────── */
  var cyclingEl = qs('#cycling-text');
  if (cyclingEl) {
    var eras = [
      'Rocawear Era.',
      'Sean John Era.',
      'FUBU Era.',
      'Phat Farm Era.',
      'Timberland Era.',
      'Akademiks Era.',
    ];
    var eraIdx = 0;
    setInterval(function () {
      cyclingEl.style.opacity = '0';
      setTimeout(function () {
        eraIdx = (eraIdx + 1) % eras.length;
        cyclingEl.textContent = eras[eraIdx];
        cyclingEl.style.opacity = '1';
      }, 400);
    }, 3000);
    cyclingEl.style.transition = 'opacity 0.4s ease';
  }

  /* ─── Countdown timer ─────────────────────────────────────────────────── */
  var cdDays = qs('#countdown-days');
  var cdHours = qs('#countdown-hours');
  var cdMins = qs('#countdown-minutes');
  var cdSecs = qs('#countdown-seconds');

  function getNextFriday() {
    var now = new Date();
    var d = new Date(now);
    d.setHours(0, 0, 0, 0);
    var day = d.getDay(); // 0=Sun, 5=Fri
    var daysUntilFriday = (5 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + daysUntilFriday);
    return d;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  if (cdDays || cdHours || cdMins || cdSecs) {
    function tick() {
      var target = getNextFriday();
      var now = new Date();
      var diff = Math.max(0, target - now);
      var s = Math.floor(diff / 1000);
      var m = Math.floor(s / 60); s %= 60;
      var h = Math.floor(m / 60); m %= 60;
      var dy = Math.floor(h / 24); h %= 24;
      if (cdDays) cdDays.textContent = pad(dy);
      if (cdHours) cdHours.textContent = pad(h);
      if (cdMins) cdMins.textContent = pad(m);
      if (cdSecs) cdSecs.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

})();
