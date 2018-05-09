/* global document, Messages */

// Framework dependencies
import angular from 'angular';
import 'angular-ui-router';
import 'ng-stomp';
import 'stompjs';
import 'angular-animate';
//import $ from 'jquery';

// Application interceptors
import Interceptor from './interceptor';

// Application Modules
import AssetMgmtModule from './modules/assetMgmt/apmSampleApp.main';
import Heatmap from './modules/heatmap/heatmap.main';

// Main Application Controller
import AppCtrl from './app-controller';

/**
 * @ngdoc object
 * @name AppModule
 * @description
 * Create our application, inject dependencies, and configure route behavior
 * NOTE: Injected modules will add their own routes
 */
let AppModule = angular.module('app', [
  'ui.router',
  'ApmSampleAppModule',
  'HeatmapModule',
  'ngStomp',
  'ngAnimate'
]).controller('AppCtrl', AppCtrl)
  .config([ '$locationProvider','$httpProvider','$urlRouterProvider','$stateProvider',
    function($locationProvider,  $httpProvider,  $urlRouterProvider,  $stateProvider){

      // Disabling html5 mode until we can sort out the weird replace-last-char-with-'/' issue
      // $locationProvider.html5Mode({
      //   enabled: true, // http://stackoverflow.com/questions/27307914/angular-error-running-karma-tests-html5-mode-requires-a-base-tag
      //   requireBase: true
      // }).hashPrefix('!');

      //$httpProvider.interceptors.push(Interceptor);

      // Batch multiple $http requests around the same time into one $digest
      $httpProvider.useApplyAsync(true);

      // This is your default route. User will get redirected
      // here if they type a weird route into the location bar.
      $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        // document.querySelector('px-app-nav').markSelected('main');
        $state.go('heatmap');
      });

    }
  ]);

// Bootstrap our application once all that stuff is loaded
angular.element(document).ready(function() {
  return angular.bootstrap(document.querySelector('#content'), [AppModule.name], {
    strictDi: true // https://docs.angularjs.org/guide/di
  });
});

export default AppModule;
