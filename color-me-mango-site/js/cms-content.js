fetch('/content.json')
  .then(function (res) { return res.json(); })
  .then(function (data) {
    document.querySelectorAll('[data-cms]').forEach(function (el) {
      var path = el.getAttribute('data-cms').split('.');
      var value = data;
      for (var i = 0; i < path.length; i++) {
        value = value && value[path[i]];
      }
      if (value) {
        el.textContent = value;
      }
    });
  })
  .catch(function () {
    // If content.json is missing or fails to load, the page keeps its built-in text.
  });
