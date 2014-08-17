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