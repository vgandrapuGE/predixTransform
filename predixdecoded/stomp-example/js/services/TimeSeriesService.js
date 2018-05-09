/**
 * Created by anhtuan on 6/27/16.
 */
Application.factory('TimeSeriesService', ['$rootScope', '$q', 'HTTPService', function($rootScope, $q, HTTPService) {
    var _this = this;

    //TODO
    var token = 'eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJhNjk0MTkxZC00Y2VjLTRkYzctYWJlYi1jMmZmZTA2MzQ1Y2QiLCJzdWIiOiJwcmVkaXhfY2xpZW50Iiwic2NvcGUiOlsiYWNzLnBvbGljaWVzLnJlYWQiLCJhY3MucG9saWNpZXMud3JpdGUiLCJ0aW1lc2VyaWVzLnpvbmVzLjM3MzM4MTk3LTcwNWItNGIyOS04ZDQ0LTE0NjQ1ZThjZTE2Ny5pbmdlc3QiLCJzY2ltLm1lIiwidWFhLnJlc291cmNlIiwiYWNzLmF0dHJpYnV0ZXMucmVhZCIsIm9wZW5pZCIsInRpbWVzZXJpZXMuem9uZXMuMzczMzgxOTctNzA1Yi00YjI5LThkNDQtMTQ2NDVlOGNlMTY3LnVzZXIiLCJhY3MuYXR0cmlidXRlcy53cml0ZSIsInRpbWVzZXJpZXMuem9uZXMuMzczMzgxOTctNzA1Yi00YjI5LThkNDQtMTQ2NDVlOGNlMTY3LnF1ZXJ5Il0sImNsaWVudF9pZCI6InByZWRpeF9jbGllbnQiLCJjaWQiOiJwcmVkaXhfY2xpZW50IiwiYXpwIjoicHJlZGl4X2NsaWVudCIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiYmUwNDdjNWYiLCJpYXQiOjE0NjcwNDg4MTUsImV4cCI6MTQ2NzA5MjAxNSwiaXNzIjoiaHR0cHM6Ly82NzExZWE3OS1lZGIwLTQ1MDEtYmQ3Yi1iNDAxY2ZiMmFjNTYucHJlZGl4LXVhYS5ydW4uYXdzLXVzdzAyLXByLmljZS5wcmVkaXguaW8vb2F1dGgvdG9rZW4iLCJ6aWQiOiI2NzExZWE3OS1lZGIwLTQ1MDEtYmQ3Yi1iNDAxY2ZiMmFjNTYiLCJhdWQiOlsicHJlZGl4X2NsaWVudCIsImFjcy5wb2xpY2llcyIsInRpbWVzZXJpZXMuem9uZXMuMzczMzgxOTctNzA1Yi00YjI5LThkNDQtMTQ2NDVlOGNlMTY3Iiwic2NpbSIsInVhYSIsImFjcy5hdHRyaWJ1dGVzIiwib3BlbmlkIl19.KX23JsqVS1E5i-yNpHC7VPsN_xf1ZGwn15cYSwPP3MGaXBAxepQu-VnhbIlsOUgBclujNJ3DrjUc1ud9_CwGQP80YC4ryC2C61_byyomPeUMmwT6OwZsmnSCniCezUqO85evRjQnCg7bTkcki-9qIqZJVzLhvrli0jqBPSIXMqJgPZhCN7IOo08dvnz-bVKyc_Jabvpge92i82G_QtEmJE9hdIbu7YdE6aH4IiaSNRoFQCV2dvc3aYzsyN_0SkqVKIxCWOZfAj0oyZwZUtlhuPgqSlYiZMRm1jV5QL_bPXG-eds-KVDxQ5O9UcL8QuqR0Cjx0qbfSPvX2GYy9PSb5Q';

    _this.getData = function(min, max, tag) {
        var deferred = $q.defer();
        new HTTPService.post({
            url: TIMESERIES_URL + '/v1/datapoints',
            data: {
                "start": min.getTime(),
                "end": max.getTime(),
                "tags": [
                    {
                        "name": tag,
                        "limit": 200000
                    }
                ]
            }
        }).then(function(resp) {
            var data= resp.data;
            $rootScope.$broadcast('onHistoryData', data.tags[0].results[0].values.map(function(value) {
                return {
                    time: value[0],
                    value: value[1]
                };
            }));
        }, deferred.reject.bind(deferred));
        return deferred.promise;

    };

    _this.getTags = function() {
        var deferred = $q.defer();
        new HTTPService.get({
            url: TIMESERIES_URL + '/v1/tags'
        }).then(function(resp) {
            deferred.resolve(resp.data.results);
        }, deferred.reject.bind(deferred));
        return deferred.promise;
    };

    return _this;
}]);