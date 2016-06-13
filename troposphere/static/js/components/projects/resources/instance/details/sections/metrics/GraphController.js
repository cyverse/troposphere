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

        var graphs = [['cpu', CPUGraph], ['mem', MemoryGraph], ['net', NetworkGraph]];
        graphs = graphs.map((data) => {
            return new data[1]({
                type: data[0],
                from: settings.from,
                until: settings.until,
                uuid: settings.uuid,
                container: this.container,
                width: this.width,
                timeframe: settings.timeframe
            });
        });

        this.store.set(key, graphs);

        // Hide current graphs
        this.graphs.forEach((g) => g.hide());

        // Show spinning loader
        document.querySelector('#container.metrics .loading').style.display = 'inherit';

        // Exit here to debug css spinning loader
        // return;

        graphs[0].create(() => {
            graphs[1].create(() => {
                graphs[2].create(() => {

                    // Hide spinning loader
                    document.querySelector('#container.metrics .loading').style.display = 'none';
                    graphs[2].makeAxis();
                    graphs.forEach(function(g) {
                        g.show();
                    });
                    this.graphs = graphs;
                    onSuccess && onSuccess();
                }, onError);
            }, onError);
        }, onError);

    } else {
        this.graphs.forEach(function(g) {
            g.hide();
        });
        graphs.forEach(function(g) {
            g.show();
        });
        this.graphs = graphs;
        onSuccess && onSuccess();
    }
};

export default GraphController;
