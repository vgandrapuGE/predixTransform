import angular from 'angular';

import 'angular-ui-router';
import ngMessages from 'angular-messages';

//Controllers
import HeatmapCtrl from './controllers/heatmapCtrl';

import SnapshotChart from './directives/snapshotChart';

//Services
import HeatmapService from './services/heatmapSrv';

// Hmmm... what's the right way to do this
// so this module doesn't have to know where it lives?
let path = './modules/heatmap/views/';

/**
 * @ngdoc object
 * @name OneModule
 * @description
 * A module skeleton.
 * @example
 * ```
 import OneModule from './<path to here>/module.js';
 let AppModule = angular.module('app', ['OneModule']);
 * ```
 */
let HeatmapModule = angular.module('HeatmapModule', [
  'ui.router',
  'app.ApmSampleApp'
])

  // Controllers
  .controller('HeatmapCtrl', HeatmapCtrl)
  .directive('snapshotChart', () => new SnapshotChart())

  // Routes
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('heatmap', {
        url: '/heatmap',
        controller: 'HeatmapCtrl',
        templateUrl: path + 'heatmap.html',
      });
  }]);

export default HeatmapModule;
