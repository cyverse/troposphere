import d3 from "d3";
import Utils from "./Utils";

let Graph = function(config) {
    config = config || {};

    switch (config.timeframe) {
      // this.points * this.resolution == 60
      case "1 hour":
        this.points = 60;
        this.resolution = 1;
        break;
      // this.points * this.resolution == 60 * 24
      case "1 day":
        this.points = 6 * 24;
        this.resolution = 10;
        break;
      // this.points * this.resolution == 60 * 24 * 7
      case "1 week":
        this.points = 24 * 7;
        this.resolution = 60;
        break;
    }

    var defaults = {
      width: 600,
      height: 100
    }

    for (prop in defaults) {
      this[prop] = defaults[prop];
    }
    for (prop in config) {
      this[prop] = config[prop];
    }

    this.element = document.createElement("div");
    this.element.style.display = "none";
    this.container.appendChild(this.element);
}

Graph.prototype = {};

Graph.prototype.create = function(onSuccess, onError) {
    var me = this;
    this.fetch(function(){
      me.make()
      onSuccess && onSuccess();
    }, onError);
}

Graph.prototype.hide = function() {
    this.element.style.display = "none";
}

Graph.prototype.show = function() {
    this.element.style.display = "inline";
}

Graph.prototype.clear = function() {
    var g = this.element;
    while (g.lastChild) {
      g.removeChild(g.lastChild);
    }
}

Graph.prototype.fetch = function(onSuccess, onError) {
    var me = this;
    var urlParams =  {
      field: this.type,
      res: this.resolution,
      size: this.points,
    }

    if (this.transform == "derivative") {
      urlParams.fun = "perSecond";
    }

    Utils.fetch(this.uuid, urlParams, function(data) {
      me.timestamp = Date.now();
      me.data = data;
      onSuccess();
    }, onError);
}

Graph.prototype.make = function() {
    var me = this;
    var data = this.data
      var graphDom = this.element;

    var yAxisWidth = 60,
      margin = {top: 10, right: 20, bottom: 5, left: yAxisWidth},
      width = this.width - margin.left - margin.right,
      height = this.height - margin.top - margin.bottom;

    getX = Utils.get("x");
    getY = Utils.get("y");

    var yMax = d3.max(data, getY);
    var yMean = d3.mean(data, getY) || 0;
    var xMax = d3.max(data, getX);
    var xMin = d3.min(data, getX);

    var showRelative = false;

    var x = d3.scale.linear()
      .range([0, width])
      .domain(d3.extent(data, getX));

    var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, (showRelative ? 1.2 * yMax : 1)]);

    var line = d3.svg.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });

    var area = d3.svg.area()
      .x(function(d) { return x(d.x); })
      .y0(height)
      .y1(function(d) { return y(d.y); });

    var svg = d3.select(graphDom).append("svg")
      .attr("width", me.width)
      .attr("height", me.height)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var delta = 0.2;
    var showMax = yMax > delta &&
      yMax < 1 - delta;

    var showMean =
      // if mean-label enough below max label
      yMean < yMax - delta * yMax &&
      // if mean-label enough above 0
      yMean > (showRelative ? delta * yMax : delta)

      if (showMean) {
        svg.append("path")
          .datum([
              { x: xMin, y: yMean },
              { x: xMax, y: yMean }
              ])
          .style("stroke-dasharray", ("3, 3"))
          .attr("class", "metrics mean line")
          .attr("d", line)
      }

    svg.append("path")
      .datum(data)
      .attr("class", "metrics rx area")
      .attr("d", area)

      var xAxis = d3.svg.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(0); });

    svg.append("path")
      .datum(data)
      .attr("class", "metrics x line")
      .attr("d", xAxis)

      svg.append("path")
      .datum(data)
      .attr("class", "metrics rx line")
      .attr("d", line)

      // Determine what ticks to display on y axis
      var ticks = [0];
    if (showMean) ticks.push(yMean);
    if (showMax) ticks.push(yMax);
    if (showRelative)
      ticks.push(yMax);
    else
      ticks.push(1);

    var yAxis = d3.svg.axis()
      .tickFormat(d3.format(showRelative ? ".1%" : ".0%"))
      .tickValues(ticks)
      .scale(y)
      .orient("left");

    svg.append("g")
      .attr("class", "metrics y axis")
      .call(yAxis)

      svg.append("text")
      .attr("class", "metrics x axis")
      .attr("style", "text-anchor:end")
      .attr("x", width)
      .attr("y", 0)
      .attr("dy", ".32em")
      .text( me.type == "cpu" ? "cpu usage": "memory usage")
};

// Horizontal labeled x axis
Graph.prototype.makeAxis = function() {

    // Cpu/Mem Graph data || Network Graph data
    var data = this.data || this.lower.data;

    var graphDom = this.element;

    // Height of this axis container
    var metricsAxisHeight = 30;

    // Define container margins
    var yAxisWidth = 60,
      margin = {top: 5, right: 20, bottom: 5, left: yAxisWidth};

    // Width/height of axis
    var width = this.width - margin.left - margin.right,
      height = metricsAxisHeight - margin.top - margin.bottom;

    var svg = d3.select(graphDom).append("svg")
      .attr("id", "labeledXAxis")
      .attr("class", "axis path")
      .attr("width", this.width)
      .attr("height", metricsAxisHeight)
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.time.scale()
      .range([0, width])
      .domain(d3.extent(data, getX));

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")

    var total_mins = this.resolution * this.points;
    if (total_mins == 60) {
      xAxis.ticks(6).tickFormat(function(){
        return d3.time.format("%_I:%M%p")
        .apply(d3.time, arguments)
        .toLowerCase()
      })
    } else if (total_mins ==  60 * 24) {
      xAxis.ticks(12).tickFormat(function(){
        return d3.time.format("%_I%p")
        .apply(d3.time, arguments)
        .toLowerCase()
      })
    } else if (total_mins == 60 * 24 * 7) {
      xAxis.ticks(7).tickFormat(d3.time.format("%a"));
    }

    svg.append("g")
      .call(xAxis)

};

Graph.prototype.makeTimestamp = function() {

    var timestamp = this.timestamp;

    var graphDom = this.element;

    // Height of the timestamp container
    var tsContainerHeight = 30;

    // Define container margins
    var yAxisWidth = 50,
      margin = {top: 0, right: 20, bottom: 0, left: yAxisWidth};

    // Width/height of axis
    var width = this.width - margin.left - margin.right,
      height = tsContainerHeight - margin.top - margin.bottom;

    var svg = d3.select(graphDom).append("svg")
      .attr("id", "updateTimestamp")
      .attr("width", this.width)
      .attr("height", tsContainerHeight)
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
      .attr("class", "metrics x axis")
      .attr("style", "text-anchor:end")
      .attr("width", this.width)
      .attr("height", height)
      .attr("x", width)
      .attr("dy", (height / 2) + "px")
      .text("Updated: " + timestamp)

};

export default Graph;
