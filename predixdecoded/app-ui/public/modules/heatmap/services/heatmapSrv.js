var moduleName = 'app.ApmSampleApp';
var serviceName = 'HeatmapService';

class HeatmapService {
    constructor($http) {
        this.$http = $http;
        this.heatmapLocalURL = 'mock/data.json';
        this.heatmapCloudURL = ''; //create url for backend call here
        this.timeseriesURL = 'timeseries';
        this.operation = 'raw';
    }

    getTimeseriesData(tagList, startTime, endTime) {
      var endpoint = this.timeseriesURL + '/data?tagList=' + tagList + '&operation=' + this.operation + '&startTime=' + startTime + '&endTime=' + endTime;
      return this.$http({
        url: endpoint,
        method: 'GET',
        cache: false});
    }

    static serviceFactory($http) {
        HeatmapService.instance = new HeatmapService($http);
        return HeatmapService.instance;
    }
}

HeatmapService.serviceFactory.$inject = ['$http'];
angular.module(moduleName, []).factory(serviceName, HeatmapService.serviceFactory);
export default moduleName;