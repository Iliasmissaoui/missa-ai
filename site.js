(function () {
  // Mobile menu
  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menu.hidden;
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'Close' : 'Menu';
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'Menu';
      }
    });
  }

  // Copy email
  var btn = document.getElementById('copy-email');
  var text = document.getElementById('email');
  if (btn && text) {
    btn.addEventListener('click', function () {
      var value = text.textContent;
      var reset = function () { setTimeout(function () { btn.textContent = 'Copy'; }, 1800); };
      var fallback = function () {
        var range = document.createRange(); range.selectNodeContents(text);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        btn.textContent = 'Selected'; reset();
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(function () { btn.textContent = 'Copied'; reset(); }, fallback);
        } else { fallback(); }
      } catch (e) { fallback(); }
    });
  }

  // Revenue estimator
  var ids = ['enquiries', 'value', 'conversion', 'lift'];
  var els = {};
  ids.forEach(function (id) { els[id] = document.getElementById(id); });
  if (els.enquiries) {
    var gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
    var update = function () {
      var enquiries = +els.enquiries.value;
      var value = +els.value.value;
      var conversion = +els.conversion.value / 100;
      var lift = +els.lift.value / 100;
      document.getElementById('enquiries-out').textContent = enquiries;
      document.getElementById('value-out').textContent = gbp.format(value);
      document.getElementById('conversion-out').textContent = els.conversion.value + '%';
      document.getElementById('lift-out').textContent = '+' + els.lift.value + '%';
      var clientsNow = enquiries * conversion;
      var clientsAfter = clientsNow * (1 + lift);
      var extraMonth = (clientsAfter - clientsNow) * value;
      document.getElementById('est-month').textContent = gbp.format(extraMonth);
      document.getElementById('est-now').textContent = clientsNow.toFixed(1);
      document.getElementById('est-after').textContent = clientsAfter.toFixed(1);
      document.getElementById('est-year').textContent = gbp.format(extraMonth * 12);
    };
    ids.forEach(function (id) { els[id].addEventListener('input', update); });
    update();
  }
})();
