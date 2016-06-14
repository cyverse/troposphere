import Graph from './Graph';
import { extend } from 'underscore';

let MemoryGraph = function(settings) {
    let defaults = {
        transform: 'total'
    };

    Graph.call(this, extend(defaults, settings));
};

MemoryGraph.prototype = Object.create(Graph.prototype);
MemoryGraph.prototype.constructor = MemoryGraph;

export default MemoryGraph;
