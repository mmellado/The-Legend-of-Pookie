Tlop = Tlop || {};

Tlop.Splash = (function() {

  var _instructions = false;

  var _load = function() {
    Tlop.Const.DOM.TLOP.appendChild(Tlop.Utils.getTemplate('splash'));
    _loadEvents();
  };

  var _unload = function() {
    _unloadEvents();
    Tlop.Settings.Setting.pause = false;
    Tlop.Map.render('main', [-2, -2]);
    Tlop.Pookie.load();
    Tlop.Menu.load();
  };

  var _actions = function(evt) {
    var key = evt.keyCode,
        selected = document.querySelector('.splash-menu .selected'),
        mainScreen = document.querySelector('.home'),
        howtoScreen = document.querySelector('.instructions'),
        next;

    evt.preventDefault();

    switch (key) {
      // Down or S
      case 40:
      case 83:
        if (!_instructions) {
          Tlop.Utils.removeClass(selected, 'selected');
          next = (selected.nextElementSibling) ? selected.nextElementSibling : selected.previousElementSibling;
          Tlop.Utils.addClass(next, 'selected');
        }
        break;

      // Up or W
      case 38:
      case 87:
        if (!_instructions) {
          Tlop.Utils.removeClass(selected, 'selected');
          next = (selected.previousElementSibling) ? selected.previousElementSibling : selected.nextElementSibling;
          Tlop.Utils.addClass(next, 'selected');
        }
        break;

      // Enter
      case 13:
        if (_instructions) {
          _instructions = false;
          Tlop.Utils.removeClass(howtoScreen, 'displayed');
          Tlop.Utils.addClass(mainScreen, 'displayed');
        } else {
          if (Tlop.Utils.hasClass(selected, 'start')) {
            _unload();
          } else {
            _instructions = true;
            Tlop.Utils.removeClass(mainScreen, 'displayed');
            Tlop.Utils.addClass(howtoScreen, 'displayed');
          }
        }
        break;
    }
  };

  var _loadEvents = function () {
    if (window.addEventListener) {
      window.addEventListener('keydown', _actions, false);
    } else if (window.attachEvent) {
      window.attachEvent('onkeydown', _actions);
    }
  };

  var _unloadEvents = function () {
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