import Graph from "./Graph";

let MemoryGraph = function(settings) {
    var defaults = {
      transform: "total"
    }

    for (prop in defaults) {
      if (settings[prop] == undefined) {
        settings[prop] = defaults[prop];
      }
    }

    Graph.call(this, settings);
};

MemoryGraph.prototype = Object.create(Graph.prototype);
MemoryGraph.prototype.constructor = MemoryGraph;

export default MemoryGraph;
