import angular from 'angular';
class controller {

    constructor($scope, $interval, $stomp) {
        this.init();
        $scope.efficiency = 'N/A';

        // let efficiencyInt = $interval(() => {
        //     $scope.efficiency = Math.random() * 100;
        // }, 10000);

        // $scope.$on("$destroy", function() {
        //     $interval.cancel(efficiencyInt);
        // });

        let stompEndpoint = 'https://creamteam-gateway.run.aws-usw02-pr.ice.predix.io/efficiency';
        let topic = '/topic/efficiency';
        let connectHeaders = {};

        var connectToWS = function() {
            var promise = $stomp.connect(stompEndpoint, {
                'reconnection': true,
                'reconnectionDelay': 1000,
                'reconnectionDelayMax': 5000,
                'forceNew': true
            });
            promise.then(function() {
                $stomp.subscribe(topic, function(payload) {
                    payload = payload;

                    $scope.efficiency = payload;
                    $scope.$apply();
                });

            });
            //reconnect
            $stomp.sock.onclose = connectToWS;
        };
        connectToWS();

    }

    init() {
        console.log('app-controller initialized');
    }
}

// Strict DI for minification (order is important)
controller.$inject = ['$scope', '$interval', '$stomp'];

export default controller;