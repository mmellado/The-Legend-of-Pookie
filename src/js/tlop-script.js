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