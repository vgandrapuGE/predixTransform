/**
 * Created by anhtuan on 6/27/16.
 */
Application.factory('HTTPService', ['$q', '$http', function($q, $http) {

    var _this = this;
    var MAX_RETRY_TIME = 3;

    _this.execute = function(method, config) {
        var fn = $http[method];
        var deferred = $q.defer();
        var bindedFn = method == 'get' ? fn.bind($http, config.url, config.config) : fn.bind($http, config.url, config.data, config.config);
        (function exec(retryTime) {
            retryTime < MAX_RETRY_TIME ? bindedFn().then(deferred.resolve.bind(deferred), exec.bind(null, ++retryTime))
              : deferred.reject;
        })(0);
        return deferred.promise;
    };

    _this.get = _this.execute.bind(this, 'get');
    _this.post = _this.execute.bind(this, 'post');

    return _this;
}]);