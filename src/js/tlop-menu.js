Tlop = Tlop || {};

Tlop.Menu = (function() {

  var _menu;

  var _load = function() {
    _menu = Tlop.Utils.getTemplate('menu');
    Tlop.Const.DOM.TLOP.appendChild(_menu);
     _loadMenuEvents();
  };

  var _unload = function() {
    _unloadMenuEvents();
    _hideMenu();
  };

  var _showMenu = function() {
    if( _menu) {
      Tlop.Utils.addClass(_menu, 'paused');
    }
  };

  var _hideMenu = function() {
    if (_menu) {
      Tlop.Utils.removeClass(_menu, 'paused');
    }
  };

  var _actions = function(evt) {
    var key = evt.keyCode,
        selected,
        next;

    if (Tlop.Settings.Setting.pause && _menu) {
      evt.preventDefault();
      selected = _menu.querySelector('.selected');
    }

    switch (key) {
      // Down or S
      case 40:
      case 83:
        if (Tlop.Settings.Setting.pause) {
          Tlop.Utils.removeClass(selected, 'selected');
          next = (selected.nextElementSibling) ? selected.nextElementSibling : selected.previousElementSibling;
          Tlop.Utils.addClass(next, 'selected');
        }
        break;

      // Up or W
      case 38:
      case 87:
        if (Tlop.Settings.Setting.pause) {
          Tlop.Utils.removeClass(selected, 'selected');
          next = (selected.previousElementSibling) ? selected.previousElementSibling : selected.nextElementSibling;
          Tlop.Utils.addClass(next, 'selected');
        }
        break;

      // Enter or L
      case 13:
        if (Tlop.Settings.Setting.pause) {
          Tlop.Settings.Setting.pause = false;
          _hideMenu();
        } else {
          Tlop.Settings.Setting.pause = true;
          _showMenu();
        }
        break;

      // K (select)
    }

    // Re enable actions
    return true;
  };

  var _loadMenuEvents = function () {
    if (window.addEventListener) {
      window.addEventListener('keydown', _actions, false);
    } else if (window.attachEvent) {
      window.attachEvent('onkeydown', _actions);
    }
  };

  var _unloadMenuEvents = function () {
    if (window.addEventListener) {
      window.removeEventListener('keydown', _actions);
    } else if (window.attachEvent) {
      window.detachEvent('onkeydown', _actions);
    }
  };

  return {
    load: _load,
    unload: _unload
  };

})();