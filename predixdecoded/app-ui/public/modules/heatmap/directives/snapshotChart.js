import d3 from 'd3';

'use strict';

class SnapshotChart {
  constructor(HeatmapService) {
    this.template = `<style>path {
                          stroke: steelblue;
                          stroke-width: 2;
                          fill: none;
                      }
                      .axis path, .axis line {
                          fill: none;
                          stroke: grey;
                          stroke-width: 1;
                          shape-rendering: crispEdges;
                      }</style>
                      <div id="{{chartId}}"></div>`;
    this.restrict = 'E';
    this.scope = {
      chartId: '@',
      chartData: '='
    };
  }


  // Directive link function
  link(scope, element, attrs) {
    function createLineChart(data, id) {
      var margin = {
          top: 30,
          right: 20,
          bottom: 30,
          left: 50
      };
      //var width = 600 - margin.left - margin.right;
      //var height = 270 - margin.top - margin.bottom;
      var width = 100;
      var height = 50;

      //var parseDate = d3.time.format("%d-%b-%y").parse;

      var x = d3.time.scale().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);

      var xAxis = d3.svg.axis().scale(x)
          .orient("bottom").ticks(0);

      var yAxis = d3.svg.axis().scale(y)
          .orient("left").ticks(0);

      var valueline = d3.svg.line()
          .x(function(d) {
              return x(d.ts);
          })
          .y(function(d) {
              return y(d.v);
          });

      var svg = d3.select(`#${id}`)
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // parse the data
      data.forEach(function(d) {
        d.ts = Date.parse(d.ts);
      });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) {
          return d.ts;
      }));
      y.domain([0, d3.max(data, function(d) {
          return d.v;
      })]);

      svg.append("path") // Add the valueline path.
          .attr("d", valueline(data));

      svg.append("g") // Add the X Axis
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g") // Add the Y Axis
          .attr("class", "y axis")
          .call(yAxis);
    }

    scope.$watch('chartData', function(){
      if(typeof scope.chartData !== 'undefined'){
        createLineChart(scope.chartData, scope.chartId);
      }

    });

  }


}
SnapshotChart.$inject = ['HeatmapService'];
export default SnapshotChart;