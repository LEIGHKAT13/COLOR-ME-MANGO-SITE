// ============================================================
// Color Me Mango — shared site behavior
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
      });
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---- Booking: service/package selection ---- */
  var optionPills = document.querySelectorAll('.option-pill[data-price]');
  var summaryService = document.getElementById('summary-service');
  var summaryDuration = document.getElementById('summary-duration');
  var summaryTotal = document.getElementById('summary-total');
  var summaryDue = document.getElementById('summary-due');
  var currentPrice = optionPills.length ? parseFloat(optionPills[0].getAttribute('data-price')) : 0;
  var currentName = optionPills.length ? (optionPills[0].getAttribute('data-name') || '') : '';
  var RUSH_PRICE = 50; // 24-hour rush add-on, Peach only
  var rushBox = document.getElementById('rush');
  var rushWrap = document.getElementById('rush-addon');
  var rushRow = document.getElementById('summary-rush-row');
  var payMode = 'full'; // 'full' or 'deposit'
  var DEPOSIT_RATE = 0.3;

  function formatMoney(n) {
    return '$' + n.toFixed(0);
  }

  function updateSummary() {
    if (!summaryTotal) return;
    var rushAllowed = currentName === 'Peach';
    if (rushWrap) rushWrap.style.display = rushAllowed ? '' : 'none';
    if (rushBox && !rushAllowed) rushBox.checked = false;
    var rushOn = !!(rushBox && rushBox.checked);
    if (rushWrap) rushWrap.querySelector('.option-pill').classList.toggle('selected', rushOn);
    if (rushRow) rushRow.style.display = rushOn ? '' : 'none';
    var total = currentPrice + (rushOn ? RUSH_PRICE : 0);
    summaryTotal.textContent = formatMoney(total);
    if (summaryDue) {
      var due = payMode === 'deposit' ? total * DEPOSIT_RATE : total;
      summaryDue.textContent = formatMoney(due) + (payMode === 'deposit' ? ' due today' : ' due today');
    }
  }

  optionPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      optionPills.forEach(function (p) { p.classList.remove('selected'); });
      pill.classList.add('selected');
      var radio = pill.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      currentPrice = parseFloat(pill.getAttribute('data-price')) || 0;
      currentName = pill.getAttribute('data-name') || '';
      if (summaryService) summaryService.textContent = pill.getAttribute('data-name') || '';
      if (summaryDuration) summaryDuration.textContent = pill.getAttribute('data-duration') || '';
      updateSummary();
    });
  });

  var payButtons = document.querySelectorAll('.pay-toggle button');
  payButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      payButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      payMode = btn.getAttribute('data-mode');
      updateSummary();
    });
  });

  if (rushBox) rushBox.addEventListener('change', updateSummary);

  /* ---- Gift option ---- */
  var giftBox = document.getElementById('gift');
  var giftFields = document.getElementById('gift-fields');
  var giftRow = document.getElementById('summary-gift-row');
  function updateGift() {
    if (!giftBox) return;
    var on = giftBox.checked;
    if (giftFields) giftFields.style.display = on ? '' : 'none';
    if (giftRow) giftRow.style.display = on ? '' : 'none';
    giftBox.closest('.option-pill').classList.toggle('selected', on);
    ['gift-name', 'gift-email'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.required = on;
    });
  }
  if (giftBox) {
    giftBox.addEventListener('change', updateGift);
    if (new URLSearchParams(window.location.search).get('gift')) giftBox.checked = true;
    updateGift();
  }

  updateSummary();

  /* ---- Pre-select a package from the link (e.g. booking.html?service=papaya) ---- */
  var wanted = new URLSearchParams(window.location.search).get('service');
  if (wanted) {
    optionPills.forEach(function (pill) {
      if ((pill.getAttribute('data-name') || '').toLowerCase() === wanted.toLowerCase()) pill.click();
    });
  }

  /* ---- Booking form submit -> placeholder checkout redirect ----
     In production, replace this handler with a real Stripe Checkout
     or Square redirect. See booking.html comments for setup notes. */
  var bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Placeholder: this is where you'd POST to your backend to create
      // a Stripe Checkout Session or redirect to a Stripe Payment Link / Square link.
      window.location.href = 'confirmation.html';
    });
  }

  /* ---- Contact form (placeholder submit) ---- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = document.getElementById('contact-success');
      var err = document.getElementById('contact-error');
      var btn = contactForm.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      // Web3Forms: submissions are emailed to the address tied to the access key
      var data = Object.fromEntries(new FormData(contactForm));
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) { return res.json(); }).then(function (json) {
        if (!json.success) throw new Error(json.message || 'Form error');
        if (ok) ok.style.display = 'block';
        if (err) err.style.display = 'none';
        contactForm.reset();
      }).catch(function () {
        if (err) err.style.display = 'block';
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
      });
    });
  }

  /* ---- Set active nav link based on current page ---- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

});
