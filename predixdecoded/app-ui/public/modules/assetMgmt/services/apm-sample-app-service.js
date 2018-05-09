var moduleName = 'app.ApmSampleApp';
var serviceName = 'ApmSampleAppService';

var apmSampleServiceBaseUrl = 'api';

class ApmSampleAppService {
    constructor($http, $q, $rootScope) {
        this.$http = $http;
        this.$q = $q;
        this.$rootScope = $rootScope;
    }

    getAssets() {
            var deferred = this.$q.defer();
            this.$http({
                url: apmSampleServiceBaseUrl + '/assets',
                method: 'GET',
                cache: false
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (data, status) {
                deferred.reject('Error fetching assets');
            });
            return deferred.promise;
        }

    static serviceFactory($http, $q, $rootScope) {
        ApmSampleAppService.instance = new ApmSampleAppService($http, $q, $rootScope);
        return ApmSampleAppService.instance;
    }
}

ApmSampleAppService.serviceFactory.$inject = ['$http', '$q', '$rootScope'];
angular.module(moduleName, []).factory(serviceName, ApmSampleAppService.serviceFactory);
export default moduleName;
