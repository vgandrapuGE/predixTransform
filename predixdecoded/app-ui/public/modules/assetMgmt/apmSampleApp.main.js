import angular from 'angular';
import 'angular-ui-router';
import ngMessages from 'angular-messages';

//Controllers
import apmSampleAppCtrl from './controllers/apmSampleAppCtrl';

//Services
import ApmSampleAppService from './services/apm-sample-app-service';

// Hmmm... what's the right way to do this
// so this module doesn't have to know where it lives?
let path = './modules/assetMgmt/views/';

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
let ApmSampleAppModule = angular.module('ApmSampleAppModule', [
  'ui.router',
  'app.ApmSampleApp'
])

  // Controllers
  .controller('apmSampleAppCtrl', apmSampleAppCtrl)

  // Routes
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('apmSampleApp', {
        url: '/apmSampleApp',
        controller: 'apmSampleAppCtrl',
        templateUrl: path + 'apmSampleApp.html',
        resolve: {
          getAssets: ['ApmSampleAppService', function(ApmSampleAppService) {
            return ApmSampleAppService.getAssets();
          }]
        }
      });
  }]);

export default ApmSampleAppModule;
