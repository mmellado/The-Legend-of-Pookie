/*!
  TheLegendOfPookie - v1.0.0 - 2014-08-17
  Experimental videogame built with HTML/CSS/JavaScript
  (c) Marcos Mellado (@mmellado) - http://mellados.com/labs/the-legend-of-pookie
*/
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
var Tlop = Tlop || {};

Tlop.Const = (function() {
  var GRID = {
    ROWS: 7,
    COLS: 15,
    START_ROW: 3,
    START_COL: 7,
    BLOCK: 80
  },

  DOM = {
    BODY: document.querySelector('body'),
    TLOP: document.getElementById('tlop')
  };

  return {
    GRID: GRID,
    DOM: DOM
  };
})();
Tlop = Tlop || {};

Tlop.Settings = (function() {

  var _Setting = {
    pause: true
  };

  return {
    Setting: _Setting
  };
})();
Tlop = Tlop || {};

Tlop.Script = (function() {
  var SCRIPTS = {
    STORY: {},
    NPC: {}
  };

  var _loadScript = function() {
    console.log('loading ' + script + ' script');
  };

  return {
    Story: SCRIPTS.STORY,
    NPC: SCRIPTS.NPC,
    loadScript: _loadScript
  };
})();
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
Tlop = Tlop || {};

Tlop.Map = (function() {
  /*

    # = Road Block
    G = Grass Block
    P = Bush Block
    O = Rock
    T = Top Edge
    L = Left Edge
    B = Bottom Edge
    R = Right Edge
    TL = Top Left Edge
    BL = Bottom Left Edge
    TR = Top Right Edge
    BR = Bottom Right Edge

   */

  var CLASSES = {
      '@': 'step',
      '#': 'road',
      'G': 'grass',
      'P': 'bush',
      'K': 'pot',
      'O': 'rock',
      'W': 'water',
      'T': 'top-edge',
      'L': 'left-edge',
      'B': 'bottom-edge',
      'R': 'right-edge',
      'TL': 'top-left-edge',
      'BL': 'bottom-left-edge',
      'TR': 'top-right-edge',
      'BR': 'bottom-right-edge'
  },

  MAPS = {
    main: {
      field: [
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','#','#','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','#','#','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','#','#','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','#','#','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
        ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G']
      ],
      objects: [
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','P','K','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','O','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@'],
        ['@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@','@']
      ]
    },
    cave: [
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#']
    ]
  },

  DATA = {
    COL: 'data-col',
    ROW: 'data-row',
    CORD: 'data-cords'
  },

  _field,
  _map,
  _currentCords = [0, 0],
  _mapSize = {};

  var _buildMapObject = function(mapName, mapObject) {
    var rows = mapObject.length,
        columns = mapObject[0].length,
        map = {
          tiles: [],
          name: mapName,
          size: {
            rows: rows,
            columns: columns
          }
        },
        i,
        j,
        row, tile;


    for (i = 0; i < rows; i++) {
      row = mapObject[i];

      for (j = 0; j < columns; j++) {
        tile = row[j];
        map.tiles.push({
          col: i,
          row: j,
          classes: CLASSES[tile]
        });
      }
    }

    return map;
  };

  var _render = function(mapName, startCords) {

    var w = window.innerWidth,
        h = window.innerHeight,
        fieldMapFile = _buildMapObject(mapName, MAPS[mapName].field),
        objectMapFile = _buildMapObject(mapName, MAPS[mapName].objects),
        fieldTiles = fieldMapFile.tiles,
        objectTiles = objectMapFile.tiles,
        fieldBlock,
        objectBlock,
        tile, i;

    // Clear the current screen
    Tlop.Const.DOM.TLOP.innerHTML = '<div id="field"></div><div id="map"></div>';

    _field = document.getElementById('field');
    _map = document.getElementById('map');

    Tlop.Const.DOM.TLOP.style.width = (Tlop.Const.GRID.COLS * Tlop.Const.GRID.BLOCK) + 'px';
    Tlop.Const.DOM.TLOP.style.height = (Tlop.Const.GRID.ROWS * Tlop.Const.GRID.BLOCK) + 'px';

    _map.className = objectMapFile.name + '-map';

    _setMapWidth(objectMapFile.size.columns * Tlop.Const.GRID.BLOCK);
    _setMapHeight(objectMapFile.size.rows * Tlop.Const.GRID.BLOCK);
    _setMapSize(objectMapFile.size.columns, objectMapFile.size.rows);

    // Position the map in the start position
    _setMapTop(startCords[0] * Tlop.Const.GRID.BLOCK);
    _setMapLeft(startCords[1] * Tlop.Const.GRID.BLOCK);

    // Set start coordinates
    _setCurrentCords((Tlop.Const.GRID.START_COL - startCords[1]), (Tlop.Const.GRID.START_ROW - startCords[0]));

    // Render the map
    for (i = 0; i < fieldTiles.length; i++) {
        fieldBlock = _buildBlock(fieldTiles[i]);
        objectTile = _buildBlock(objectTiles[i]);

        _field.appendChild(fieldBlock);
        _map.appendChild(objectTile);
    }

  };

  var _buildBlock = function(data) {
    var block = document.createElement('DIV');
        block.className = 'block ' + data.classes;
        block.style.top = (data.row * Tlop.Const.GRID.BLOCK) + 'px';
        block.style.left = (data.col * Tlop.Const.GRID.BLOCK) + 'px';
        block.style.width = Tlop.Const.GRID.BLOCK + 'px';
        block.style.height = Tlop.Const.GRID.BLOCK + 'px';
        block.setAttribute(DATA.CORD, data.row + '-' + data.col);
        block.setAttribute(DATA.ROW, data.col);
        block.setAttribute(DATA.COL, data.row);

    return block;
  };

  var _getCurrentCords = function() {
    return _currentCords;
  };

  var _setCurrentCords = function(row, col) {
    _currentCords = [row, col];
  };

  var _setMapTop = function(top) {
    _map.style.top = top + 'px';
    _field.style.top = top + 'px';
  };

  var _setMapLeft = function(left) {
    _map.style.left = left + 'px';
    _field.style.left = left + 'px';
  };

  var _setMapWidth = function(width) {
    _map.style.width = width + 'px';
    _field.style.width = width + 'px';
  };

  var _setMapHeight = function(height) {
    _map.style.height = height + 'px';
    _field.style.height = height + 'px';
  };

  var _setMapSize = function(cols, rows) {
    _mapSize = {cols: cols, rows: rows};
  };

  var _getMapSize = function() {
    return _mapSize;
  };

  return {
    render: _render,
    getCurrentCords: _getCurrentCords,
    setCurrentCords: _setCurrentCords,
    setMapTop: _setMapTop,
    setMapLeft: _setMapLeft,
    getMapSize: _getMapSize
  };
})();
Tlop = Tlop || {};

Tlop.Pookie = (function(){
  var ORT = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
  },

  DATA = {
    COL: 'data-col',
    ORIENTATION: 'data-orientation',
    ROW: 'data-row'
  },

  OBJECT = {
    POT: 'pot',
    BUSH: 'bush',
    MONSTER: 'monster'
  },

  CLASS = {
    NPC: 'npc',
    STEP: 'step'
  },

  _pookie;

  var _init = function() {
    _pookie = document.createElement('DIV');
    _pookie.id = 'pookie';
    _pookie.style.top = (Tlop.Const.GRID.START_ROW * Tlop.Const.GRID.BLOCK) + 'px';
    _pookie.style.left = (Tlop.Const.GRID.START_COL * Tlop.Const.GRID.BLOCK) + 'px';
    _pookie.style.width = Tlop.Const.GRID.BLOCK + 'px';
    _pookie.style.height = Tlop.Const.GRID.BLOCK + 'px';
    _pookie.setAttribute(DATA.ORIENTATION, ORT.UP);

    _render();
    _events();
  };


  var _getPookie = function() {
    return _pookie;
  };

  var _setOrientation = function(o) {
    _pookie.setAttribute(DATA.ORIENTATION, o);
  };

  var _render = function() {
    Tlop.Const.DOM.TLOP.appendChild(_pookie);
  };

  var _move = function(evt) {
    var top = parseInt(document.getElementById('map').style.top, 10),
        left = parseInt(document.getElementById('map').style.left, 10),
        mapSize = Tlop.Map.getMapSize(),
        mapWidth = mapSize.cols,
        mapHeight = mapSize.rows,
        orientation = _pookie.getAttribute(DATA.ORIENTATION),
        currentCords = Tlop.Map.getCurrentCords(),
        nextTile = '';

    if (!Tlop.Settings.Setting.pause) {
      switch (evt.charCode) {
        // Up
        case 119:
          nextTile = document.querySelector('#map div[data-cords="' + currentCords[0] + '-' + (currentCords[1]-1) + '"]');
          _pookie.setAttribute(DATA.ORIENTATION, ORT.UP);
          if (nextTile && (nextTile.getAttribute(DATA.ROW) >= 0) && Tlop.Utils.hasClass(nextTile, CLASS.STEP)) {
            Tlop.Map.setCurrentCords(currentCords[0], currentCords[1] -1);
            Tlop.Map.setMapTop(top + Tlop.Const.GRID.BLOCK);
          }
          break;

        // Down
        case 115:
          nextTile = document.querySelector('#map div[data-cords="' + currentCords[0] + '-' + (currentCords[1]+1) + '"]');
          _pookie.setAttribute(DATA.ORIENTATION, ORT.DOWN);
          if (nextTile && (nextTile.getAttribute(DATA.ROW) < mapHeight) && Tlop.Utils.hasClass(nextTile, CLASS.STEP)) {
            Tlop.Map.setCurrentCords(currentCords[0], currentCords[1] + 1);
            Tlop.Map.setMapTop(top - Tlop.Const.GRID.BLOCK);
          }
          break;

        // Left
        case 97:
          // increase left
          nextTile = document.querySelector('#map div[data-cords="' + (currentCords[0]-1) + '-' + currentCords[1] + '"]');
          _pookie.setAttribute(DATA.ORIENTATION, ORT.LEFT);

          if (nextTile && (nextTile.getAttribute(DATA.COL) >= 0) && Tlop.Utils.hasClass(nextTile, CLASS.STEP)) {
            Tlop.Map.setCurrentCords(currentCords[0] - 1, currentCords[1]);
            Tlop.Map.setMapLeft(left + Tlop.Const.GRID.BLOCK);
          }
          break;

        // Right
        case 100:
          // decrease left
          nextTile = document.querySelector('#map div[data-cords="' + (currentCords[0]+1) + '-' + currentCords[1] + '"]');
          _pookie.setAttribute(DATA.ORIENTATION, ORT.RIGHT);

          if (nextTile && (nextTile.getAttribute(DATA.COL) < mapWidth) && Tlop.Utils.hasClass(nextTile, CLASS.STEP)) {
            Tlop.Map.setCurrentCords(currentCords[0] + 1, currentCords[1]);
            Tlop.Map.setMapLeft(left - Tlop.Const.GRID.BLOCK);
          }
          break;
      }
    }
  };

  var _actions = function(evt) {
    var o = _pookie.getAttribute(DATA.ORIENTATION),
        currentCords = Tlop.Map.getCurrentCords(),
        key = evt.keyCode,
        interactedTile,
        script,
        monsterHP;

    if (!Tlop.Settings.Setting.pause) {
      switch (o) {
        case ORT.UP:
          interactedTile = document.querySelector('#map div[data-cords="' + currentCords[0] + '-' + (currentCords[1]-1) + '"]');
          break;

        case ORT.DOWN:
          interactedTile = document.querySelector('#map div[data-cords="' + currentCords[0] + '-' + (currentCords[1]+1) + '"]');
          break;

        case ORT.LEFT:
          interactedTile = document.querySelector('#map div[data-cords="' + (currentCords[0]-1) + '-' + currentCords[1] + '"]');
          break;

        case ORT.RIGHT:
          interactedTile = document.querySelector('#map div[data-cords="' + (currentCords[0]+1) + '-' + currentCords[1] + '"]');
          break;
      }

      if (key == 75) {
        // J = interact
        if (interactedTile && Tlop.Utils.hasClass(interactedTile, CLASS.NPC)) {
          script = interactedTile.getAttribut('data-script-name');
          Tlop.Script.loadScript(script);
        }
      } else if (key == 76) {
        // K = attack
        if (interactedTile && (Tlop.Utils.hasClass(interactedTile, OBJECT.POT) || Tlop.Utils.hasClass(interactedTile, OBJECT.BUSH))) {
          Tlop.Utils.addClass(interactedTile, CLASS.STEP);
          setTimeout(function() {
            Tlop.Utils.removeClass(interactedTile, CLASS.STEP);
          }, 60000);

        } else if (interactedTile && Tlop.Utils.hasClass(interactedTile, OBJECT.MONSTER)) {
          monsterHP = interactedTile.getAttribute('data-hp') - 5;
        }
      }
    }
  };


  var _events = function() {
    if (window.addEventListener) {
      window.addEventListener('keypress', _move, false);
      window.addEventListener('keydown', _actions, false);
    } else if (window.attachEvent) {
      window.attachEvent('onkeypress', _move);
      window.attachEvent('onkeydown', _actions);
    }
  };

  return {
    init: _init
  };

})();
var Tlop = Tlop || {};

Tlop.Engine = (function() {

  var _init = function() {
    Tlop.Splash.load();
  };

  _init();
})();