define(function(require) {

  var Graph = require("./Graph");

  var MemoryGraph = function(settings) {
    var prop,
      defaults = {
        transform: "total"
      };

    for (prop in defaults) {
      if (settings[prop] == undefined) {
        settings[prop] = defaults[prop];
      }
    }

    Graph.call(this, settings);
  };

  MemoryGraph.prototype = Object.create(Graph.prototype);
  MemoryGraph.prototype.constructor = MemoryGraph;

  return MemoryGraph;
})
