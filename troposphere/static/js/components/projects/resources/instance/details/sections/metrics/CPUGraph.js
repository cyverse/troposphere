import Graph from "./Graph";

let CPUGraph = function(settings) {
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

export default CPUGraph;
