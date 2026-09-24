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
  var payMode = 'full'; // 'full' or 'deposit'
  var DEPOSIT_RATE = 0.3;

  function formatMoney(n) {
    return '$' + n.toFixed(0);
  }

  function updateSummary() {
    if (!summaryTotal) return;
    summaryTotal.textContent = formatMoney(currentPrice);
    if (summaryDue) {
      var due = payMode === 'deposit' ? currentPrice * DEPOSIT_RATE : currentPrice;
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

  updateSummary();

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
      var msg = document.getElementById('contact-success');
      if (msg) msg.style.display = 'block';
      contactForm.reset();
    });
  }

  /* ---- Set active nav link based on current page ---- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

});
