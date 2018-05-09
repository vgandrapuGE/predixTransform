import d3 from 'd3';
import $ from 'jquery';

// start of the week in question
var startDate = new Date('2016-07-18T00:00:00.000Z');

'use strict';

class HeatmapCtrl {
  constructor($scope, $state, $timeout, $compile, HeatmapService) {
    $scope.flow_series = [];
    $scope.output_series = [];

    function transformData(data){
      var transformed = [];

      data.forEach(function(point){
        transformed.push({
          'x' : Date.parse(point.ts),
          'y' : point.v
        });
      });

      return transformed;
    }
    // APM nav width not part of window.innerWidth
    var navWidth = document.getElementsByTagName('aside')[0] ? document.getElementsByTagName('aside')[0].offsetWidth : 0;
    var margin = { top: 50, right: 0, bottom: 80, left: 30 },
        width = window.innerWidth - 50 - margin.left - margin.right - navWidth,
        height = width/2.2 - margin.top - margin.bottom,
        gridSize = Math.floor(width / 24),
        legendElementWidth = gridSize*2,
        buckets = 9,
        //colors = ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026"], // alternatively colorbrewer.YlGnBu[9]
        colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],
        days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom - 60)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dayLabels = svg.selectAll(".dayLabel")
        .data(days)
        .enter().append("text")
          .text(function(d) { return d; })
          .attr("x", 0)
          .attr("y", function(d, i) { return i * gridSize; })
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
          .attr("class", function(d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

    var timeLabels = svg.selectAll(".timeLabel")
        .data(times)
        .enter().append("text")
          .text(function(d) { return d; })
          .attr("x", function(d, i) { return i * gridSize; })
          .attr("y", 0)
          .style("text-anchor", "middle")
          .attr("transform", "translate(" + gridSize / 2 + ", -6)")
          .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

    var heatmapChart = function(jsonFile) {
      d3.json(jsonFile, function(error, data) {
        var colorScale = d3.scale.quantile()
            .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
            .range(colors);

        var cards = svg.selectAll(".hour")
            .data(data, function(d) {return d.day+':'+d.hour;});

        cards.enter().append("rect")
            .attr("x", function(d) { return (d.hour - 1) * gridSize; })
            .attr("y", function(d) { return (d.day - 1) * gridSize; })
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0])

        cards.append("title")
          .text(function(d) { return d.value; });

        cards.on("click", function(d) {

          $scope.showModal = true;
          var startTime = new Date(startDate.getTime() + (24*60*60*1000*(d.day-1)) + ((60*60*1000*d.hour)));
          // thanks HiCharts for ruining an hour of our life
          if (d.day==3 && d.hour==12) {
            var endTime = new Date(startTime.getTime() + (1000*60*10));
          } else {
            var endTime = new Date(startTime.getTime() + (1000*60*60));
          }
          console.log(startTime,endTime);
          startTime = startTime.toISOString();
          endTime = endTime.toISOString();
          console.log(startTime,endTime);
          HeatmapService.getTimeseriesData('TAG_GRACIA_FUELFLOW',startTime,endTime).then(function(response_heat) {
            $scope.flow_series = transformData(response_heat.data.tagList[0].data);
          }),(function(error){
            console.log("ERR");
          })

          HeatmapService.getTimeseriesData('TAG_GRACIA_POWER',startTime,endTime).then(function(response_power) {
              $scope.output_series = transformData(response_power.data.tagList[0].data);
            }),(function(error){
                console.log("ERROR");
            });
        });

        cards.transition().duration(1000)
            .style("fill", function(d) { return colorScale(d.value); });

        cards.exit().remove();

        var legend = svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function(d) { return d; });

        legend.enter().append("g")
            .attr("class", "legend");

        legend.append("rect")
          .attr("x", function(d, i) { return legendElementWidth * i; })
          .attr("y", height - 30)
          .attr("width", legendElementWidth)
          .attr("height", gridSize / 2)
          .style("fill", function(d, i) { return colors[i]; });

        legend.append("text")
          .attr("class", "mono")
          .text(function(d) { return "≥ " + Math.round(d); })
          .attr("x", function(d, i) { return legendElementWidth * i; })
          .attr("y", height - 30 + gridSize);

        legend.exit().remove();
      });
    };

    //heatmapChart(HeatmapService.heatmapLocalURL);
    // heatmapChart('https://spiderman-heatmap-ingestor.run.aws-usw02-pr.ice.predix.io/api/?startDate=' + startDate);
    heatmapChart('heatmap_summary/?startDate=' + startDate);

  }
}

HeatmapCtrl.$inject = ['$scope', '$state', '$timeout', '$compile', 'HeatmapService'];
export default HeatmapCtrl;

