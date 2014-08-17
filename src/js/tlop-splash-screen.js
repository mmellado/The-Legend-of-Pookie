Tlop = Tlop || {};

Tlop.Splash = (function() {

  var _instructions = false;

  var _load = function() {
    Tlop.Const.DOM.TLOP.innerHTML = _template();
    _loadEvents();
  };

  var _unload = function() {
    _unloadEvents();
    Tlop.Map.render('main', [-2, -2]);
    Tlop.Settings.Setting.pause = false;
    Tlop.Pookie.init();
  };

  var _actions = function(evt) {
    var key = evt.keyCode,
        selected = document.querySelector('.splash-menu .selected'),
        mainScreen = document.querySelector('.home'),
        howtoScreen = document.querySelector('.instructions'),
        next;

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
      case 13: {
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
      }
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

  var _template = function() {
    var out = '';

    out += '<div id="splash">';
    out += '  <div class="home displayed">';
    out += '    <h1>The Legend of Pookie</h1>';
    out += '    <h2>A Pug to the Past</h2>';
    out += '    <ul class="splash-menu">';
    out += '      <li class="start selected">Press \'ENTER\' to start</li>';
    out += '      <li class="howto">How to Play</li>';
    out += '    </ul>';
    out += '  </div>';
    out += '  <div class="instructions">';
    out += '    <h1>How to play</h1>';
    out += '    <ul>';
    out += '      <li>Move using the \'WASD\' keys</li>';
    out += '      <li>K = Talk/Select</li>';
    out += '      <li>L = Attack</li>';
    out += '      <li>Enter = Pause</li>';
    out += '    </ul>';
    out += '  </div>';
    out += '</div>';

    return out;
  };

  return {
    load: _load,
    unload: _unload
  };
})();