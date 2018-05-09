/**
 * Created by anhtuan on 6/27/16.
 */
Application.controller('HistoricalCtrl', [
    '$scope',
    '$rootScope',
    'TimeSeriesService',
    function($scope, $rootScope, TimeSeriesService) {

        $scope.dateOptions = {};
        $scope.format = 'MM-dd-yyyy';

        $scope.minPopup = {
            opened: false
        };

        $scope.maxPopup = {
            opened: false
        };

        $scope.openMinPopup = function() {
            $scope.minPopup.opened = true;
        };

        $scope.openMaxPopup = function() {
            $scope.maxPopup.opened = true;
        };

        TimeSeriesService.getTags().then(function(tags) {
            $rootScope.tags = $scope.tags = tags;
            $rootScope.selectedTag = $scope.selectedTag = $scope.tags[0];
        });

        $scope.selectTag = function(tag) {
            $rootScope.selectedTag = $scope.selectedTag = tag;
        };

        $scope.$watch('minDate', function(value) {
            value && $scope.selectedTag && $scope.maxDate && TimeSeriesService.getData(value, $scope.maxDate, $scope.selectedTag);
        });
        $scope.$watch('maxDate', function(value) {
            value && $scope.selectedTag && $scope.minDate && TimeSeriesService.getData($scope.minDate, value, $scope.selectedTag);
        });
        $scope.$watch('selectedTag', function(value) {
            $scope.maxDate && value && $scope.minDate && TimeSeriesService.getData($scope.minDate, $scope.maxDate, value);
        });


    }
]);