this["Tlop"] = this["Tlop"] || {};
this["Tlop"]["Templates"] = this["Tlop"]["Templates"] || {};

this["Tlop"]["Templates"]["menu"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"pause-menu\">\n  <ul>\n    <li class=\"time selected\">Time played</li>\n    <li class=\"exit\">Exit</li>\n  </ul>\n</div>";
  });

this["Tlop"]["Templates"]["splash"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"splash\">\n  <div class=\"home displayed\">\n    <h1>The Legend of Pookie</h1>\n    <h2>A Pug to the Past</h2>\n    <ul class=\"splash-menu\">\n      <li class=\"start selected\">Press 'ENTER' to start</li>\n      <li class=\"howto\">How to Play</li>\n    </ul>\n  </div>\n  <div class=\"instructions\">\n    <h1>How to play</h1>\n    <ul>\n      <li>Move using the 'WASD' keys</li>\n      <li>K = Talk/Select</li>\n      <li>L = Attack</li>\n      <li>Enter = Pause</li>\n    </ul>\n  </div>\n</div>";
  });