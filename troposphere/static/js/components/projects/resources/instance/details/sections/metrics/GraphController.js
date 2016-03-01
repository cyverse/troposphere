// Metrics utils
import Store from './Store';
import CPUGraph from './CPUGraph';
import MemoryGraph from './MemoryGraph';
import NetworkGraph from './NetworkGraph';


let GraphController = function(config) {
    this.container = config.container;
    this.width = config.width;
    this.store = new Store();
    this.graphs = [];
};

GraphController.prototype.switch = function(settings, onSuccess, onError) {
    var me = this;

    // Forcing a refresh is equivalent to emptying the store so that data
    // must be fetched
    if (settings.refresh)
      this.store.removeAll();

    var key = {
      uuid: settings.uuid,
      timeframe: settings.timeframe
    };

    var graphs = this.store.get(key);

    // Fetch data/build graphs for a timeframe
    if (graphs == undefined) {

      var graphs = [["cpu", CPUGraph], ["mem", MemoryGraph], ["net", NetworkGraph]];
      graphs = graphs.map(function(data) {
        return new data[1]({
          type: data[0],
          uuid: settings.uuid,
          container: me.container,
          width: me.width,
          timeframe: settings.timeframe
        });
      });

      me.store.set(key, graphs);

      // Hide current graphs
      me.graphs.forEach(function(g){ g.hide(); });

      // Show spinning loader
      document.querySelector("#container.metrics .loading").style.display = "inherit";

      // Exit here to debug css spinning loader
      // return;

      graphs[0].create(function(){
        graphs[1].create(function() {
          graphs[2].create(function() {

            // Hide spinning loader
            document.querySelector("#container.metrics .loading").style.display = "none";
            graphs[2].makeAxis();
            graphs.forEach(function(g){ g.show(); });
            me.graphs = graphs;
            onSuccess && onSuccess();
          }, onError);
        }, onError);
      }, onError);

    } else {
      me.graphs.forEach(function(g){ g.hide(); });
      graphs.forEach(function(g){ g.show(); });
      me.graphs = graphs;
      onSuccess && onSuccess();
    }
};

export default GraphController;

