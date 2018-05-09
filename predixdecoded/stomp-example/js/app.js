/**
 * Created by anhtuan on 6/21/16.
 */
var Application = angular.module('Application', [
    'ngStomp',
    'ui.bootstrap'
]);

Application.run(['UserService', '$rootScope', function(UserService, $rootScope) {
    UserService.getUserInfo().then(function(user) {
        $rootScope.user = user;
    });
}]);

Application.controller('MainCtrl', [
    '$scope', '$rootScope', 'TimeSeriesService',
    function($scope, $rootScope, TimeSeriesService) {

        var fullScreenEl = null;

        $scope.isLiveMode = true;

        $scope.toogle = function() {
            $scope.isLiveMode = !$scope.isLiveMode;
        };

        $scope.toogleFullScreen = function(id) {
            var el = document.querySelector('#' + id + '-container');

            if (el && !document.webkitFullscreenElement) {
                var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
                rfs.call(el);
                fullScreenEl = $(el);
            } else if (document.webkitFullscreenElement) {
                jQuery.event.trigger({type: 'keypress', which: 27});
            }
        };

    }]);