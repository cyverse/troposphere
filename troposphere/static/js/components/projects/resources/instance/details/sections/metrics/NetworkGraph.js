define(function(require) {

   var d3 = require("d3");
   var Graph = require("./Graph");
   var Utils = require("./Utils");

  var NetworkGraph = function(settings) {
    var prop,
      defaults = {
        type : "net",
        upper : {
          query: "*.*." + settings.uuid + ".rx",
          type: "rx",
          data: [],
          transform: "derivative",
        },
        lower : {
          query: "*.*." + settings.uuid + ".tx",
          type: "tx",
          data: [],
          transform: "derivative",
        }
      };

    for (prop in defaults) {
      this[prop] = defaults[prop];
    }

    for (prop in settings) {
      this[prop] = settings[prop];
    }

    Graph.call(this, settings);
  };

  NetworkGraph.prototype = Object.create(Graph.prototype);
  NetworkGraph.prototype.constructor = NetworkGraph;

  NetworkGraph.prototype.fetch = function(onSuccess, onError) {
    var me = this,
      series = [ this.upper, this.lower ];

    series.forEach(function(s) {
      s.urlParams = {
        field: s.type,
        res: me.resolution,
        size: me.points,
      };

      if (s.transform == "derivative")
        s.urlParams.fun = "perSecond";
      else
        s.urlParams.fun = "";
    });

    Utils.fetch(me.uuid, series[0].urlParams, function(data) {
      series[0].data = data;
      Utils.fetch(me.uuid, series[1].urlParams, function(data) {
        series[1].data = data;
        me.timestamp = Date.now();
        onSuccess.call(me);
      }, onError);
    }, onError);
  };

  NetworkGraph.prototype.make = function() {
      var me = this;
      var graphDom = me.element,
        data = me.lower.data,
        rxData = me.upper.data,
        txData = me.lower.data;

      var getX = Utils.get("x");
      var getY = Utils.get("y");

      var metricsAxisHeight = 20,
        yAxisWidth = 60,
        margin = {top: 10, right: 20, bottom: 5, left: yAxisWidth},
        width = this.width - margin.left - margin.right,
        height = this.height - margin.top - margin.bottom;

      var yMax = d3.max([ d3.max(rxData, getY)
              , d3.max(txData, getY)
               , 1.2 * 1024]) || 0;
      var yMeanUpper = d3.max([ d3.mean(rxData, getY)
               , d3.mean(rxData, getY)]) || 0;
      var yMeanLower = d3.max([ d3.mean(txData, getY)
               , d3.mean(txData, getY)]) || 0;


      var xMax = d3.max(data, getX);
      var xMin = d3.min(data, getX);

      var x = d3.time.scale()
        .range([0, width])
        .domain(d3.extent(data, getX));

      var y = d3.scale.linear()
        .range([height, 0])
        .domain([-1.2 * yMax,  1.2 * yMax]);

      var line = d3.svg.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

      var area = d3.svg.area()
      .x(function(d) { return x(d.x); })
      .y0(height/2)
      .y1(function(d) { return y(d.y); });

      var lineReflect = d3.svg.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return - y(d.y); });

      var areaReflect = d3.svg.area()
      .x(function(d) { return x(d.x); })
      .y0(height/2)
      .y1(function(d) { return -y(d.y) + height; });

      var svg = d3.select(graphDom).append("svg")
        .attr("width", me.width)
        .attr("height", me.height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      var delta = 0.2;
      var showMeanUpper =
         yMeanUpper < yMax - delta * yMax &&
         yMeanUpper > delta * yMax;

      var showMeanLower =
         yMeanLower < yMax - delta * yMax &&
         yMeanLower > delta * yMax;

      if (showMeanUpper && showMeanLower) {
        svg.append("path")
        .datum([
          { x: xMin, y: yMeanUpper },
          { x: xMax, y: yMeanUpper }
        ])
        .style("stroke-dasharray", ("3, 3"))
        .attr("class", "metrics mean line")
        .attr("d", line);

        svg.append("path")
        .datum([
          { x: xMin, y: -yMeanLower },
          { x: xMax, y: -yMeanLower }
        ])
        .style("stroke-dasharray", ("3, 3"))
        .attr("class", "metrics mean line")
        .attr("d", line);
      }

      var middleAxis = d3.svg.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(0); });

      svg.append("path")
      .datum(rxData)
      .attr("class", "metrics rx area")
      .attr("d", area);

      svg.append("path")
      .datum(txData)
      .attr("class", "metrics tx area")
      .attr("d", areaReflect);

      svg.append("path")
      .datum(txData)
      .attr("class", "metrics tx line")
      .attr("d", lineReflect)
      .attr("transform", "translate(0," + height + ")");

      svg.append("path")
      .datum(rxData)
      .attr("class", "metrics rx line")
      .attr("d", line);

      var yTick = Math.max(1024, yMax);
      var yAxis = d3.svg.axis()
        .tickFormat(function(d){
          return Utils.bytesToString(Math.abs(d));
        })
        .tickValues([ -yTick, yTick, 0 /*yMeanUpper, -yMeanLower*/])
        .scale(y)
        .orient("left");

      svg.append("g")
      .attr("class", "metrics y axis")
      .call(yAxis);

      svg.append("text")
      .attr("class", "metrics x axis")
      .attr("style", "text-anchor:end")
      .attr("x", width)
      .attr("y", 0)
      .attr("dy", ".32em")
      .text("data in");

      svg.append("text")
      .attr("class", "metrics x axis")
      .attr("style", "text-anchor:end")
      .attr("x", width)
      .attr("y", height)
      .attr("dy", ".32em")
      .text("data out");
  };

  return NetworkGraph;
});
