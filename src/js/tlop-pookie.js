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