define(function(require) {

  var Graph = require("./Graph");

  var CPUGraph = function(settings) {
    var defaults = {
      transform: "derivative"
    }

    for (prop in defaults) {
      if (settings[prop] == undefined) {
        settings[prop] = defaults[prop];
      }
    }

    Graph.call(this, settings);
  };

  CPUGraph.prototype = Object.create(Graph.prototype);
  CPUGraph.prototype.constructor = CPUGraph;

  return CPUGraph;

})
