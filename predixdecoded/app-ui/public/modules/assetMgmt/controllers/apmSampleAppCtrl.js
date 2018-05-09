class apmSampleAppCtrl {
  constructor($scope, $rootScope, $state, $timeout, ApmSampleAppService, getAssets) {
    $rootScope.tenantInfo = null;
    $rootScope.userPreferenceForAssetName = null;
    $scope.assets = getAssets;

    console.log('getAssets::', getAssets)

        /*$scope.getData = function () {

            ApmSampleAppService.getAssets()
                .then(function (result) {
                    $scope.assets = result;
                }, function (data, status) {
                    console.log("Error fetching data:", status);
                });
        };

       $scope.getData();*/

  }
}

apmSampleAppCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'ApmSampleAppService', 'getAssets'];
export default apmSampleAppCtrl;
