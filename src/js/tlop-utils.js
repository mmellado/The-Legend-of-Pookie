var Tlop = Tlop || {};

Tlop.Utils = (function() {

  function _hasClass(el, c) {
    return (' ' + el.className + ' ').indexOf(' ' + c + ' ') > -1;
  }

  function _addClass(el, c) {
    var classes = el.className;

    if (!el || !c) return;

    if (!classes) {
      el.className = c;
    } else {
      if (classes.indexOf(c) !== '-1') {
        el.className = classes + ' ' + c;
      }
    }
  }

  function _removeClass(el, c) {
    var classes = el.className;

    if (!el || !c || !classes) return;
    classes = classes.replace(' ' + c, '');
    classes = classes.replace(c + ' ', '');
    classes = classes.replace(c, '');

    el.className = classes;
  }

  return {
    hasClass: _hasClass,
    addClass: _addClass,
    removeClass: _removeClass
  };
})();