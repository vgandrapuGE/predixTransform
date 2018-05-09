/**
 * Created by anhtuan on 6/27/16.
 */

Application.controller('ChartCtrl', [
    '$scope', '$rootScope', '$stomp', '$filter',
    function($scope, $rootScope, $stomp, $filter) {

        $scope.charts = {};

        var getConfig = function(time, value, name) {
            var range  = null,
                config = {
                    type: 'time.line',
                    data: [
                        {
                            label: name,
                            values: [{time: time / 1000, y: value}]
                        }
                    ],
                    margins: {right: 40, left: 10},
                    ticks: {time: 5},
                    axes: ['bottom', 'right', 'left']
                };
            if (name.indexOf('Temperature') >= 0) {
                range = [30, 120];
            } else if (name.indexOf('Piezo') >= 0) {
                range = [0, 1];
            }
            range && (config.range = range);
            return config;
        };

        var connectToWS = function() {
            var promise = $stomp.connect(BACKEND_URL, {
                'reconnection': true,
                'reconnectionDelay': 1000,
                'reconnectionDelayMax': 5000,
                'forceNew': true
            });
            promise.then(function() {
                $stomp.subscribe(TOPIC, function(payload) {
                    payload = payload.body;
                    payload.forEach(function(payload) {
                        var latestDataPoint = payload.datapoints[payload.datapoints.length - 1];
                        var time  = latestDataPoint[0],
                            value = latestDataPoint[1];

                        console.log("Got %s %s %s", payload.name, new Date(time), value);
                        var chart = $scope.charts[payload.name] || $('#chart-' + payload.name).epoch(getConfig(time, value, payload.name));
                        chart.push([{
                            time: time / 1000,
                            y: value
                        }]);
                        $scope.charts[payload.name] = chart;
                    });
                });
            });
            //reconnect
            $stomp.sock.onclose = connectToWS;
        };

        $scope.$on('onHistoryData', function(e, data) {
            $('#historyChart').highcharts({
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: data.map(function(d) {
                        return $filter('date')(new Date(d.time), 'MM/dd/yyyy hh:mm:ss');
                    })
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: ''
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: $rootScope.selectedTag,
                    data: data.map(function(d) {
                        return d.value;
                    })
                }]
            });
        });
        connectToWS();
    }]);
