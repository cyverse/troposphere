import Graph from './Graph';
import { extend } from 'underscore';


let CPUGraph = function(settings) {
    let defaults = {
        transform: 'derivative'
    };

    Graph.call(this, extend(defaults, settings));
};

CPUGraph.prototype = Object.create(Graph.prototype);
CPUGraph.prototype.constructor = CPUGraph;

export default CPUGraph;
