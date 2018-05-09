import angular from 'angular';
import 'angular-mocks';

import Controller from '../app-controller';

describe('Application Controller', function() {

    it('should add two numbers', function() {
        expect(2+2).toEqual(4);
    })

  // // Start by creating an instance of the controller
  // // that we can use for all subsequent tests.
  // let controller, rootScope, state, NavService;

  // beforeEach(function(){
  //   // Mock our service
  //   // TODO: needs to return a promise
  //   let MockNavService = {
  //     getNavItems: function() {
  //       return true;
  //     }
  //   };
  //   module(function($provide){
  //     $provide.value('NavService', MockNavService);
  //   });
  // });

  // // Note the use of 'inject' here. That's so we can 'inject' dependencies!
  // beforeEach(module('ui.router')); // needed for $state
  // beforeEach(inject(function(_$rootScope_, _$state_, _NavService_){
  //   // dependencies used by controller
  //   rootScope = _$rootScope_;
  //   state = _$state_;
  //   NavService = _NavService_;
  //   // OK, create the controller
  //   controller = new Controller(rootScope, state);
  // }));

  // it('should create some tabs', () => {
  //   let states = [{'name':'','url':'^','views':null,'abstract':true},{'abstract':true,'url':'/app','template':'<ui-view/>','name':'app'},{'parent':'app','url':'/a','controller':'ACtrl','templateUrl':'./modules/one/views/a.html','controllerAs':'vm','nav':{'label':'Module One','icon':'fa-unlock','children':['b']},'name':'a'},{'url':'/b','parent':'app','controller':'BCtrl','templateUrl':'./modules/one/views/b.html','controllerAs':'vm','nav':{'label':'One B','icon':'fa-unlock'},'name':'b'},{'abstract':true,'url':'/secure','template':'<ui-view/>','resolve':{},'name':'secure'},{'parent':'secure','url':'/c','controller':'CCtrl','templateUrl':'./modules/two/views/c.html','controllerAs':'vm','nav':{'label':'Module Two','icon':'fa-lock','children':['d']},'name':'c'},{'parent':'secure','url':'/d','controller':'DCtrl','templateUrl':'./modules/two/views/d.html','controllerAs':'vm','nav':{'label':'Two D','icon':'fa-lock'},'name':'d'}];
  //   let tabs = [{'icon':'fa-unlock','state':'app/a','label':'Module One','subitems':[{'label':'One B','state':'app/b'}]},{'icon':'fa-lock','state':'secure/c','label':'Module Two','subitems':[{'label':'Two D','state':'secure/d'}]}];
  //   expect(controller.configureTabs(states, ['a', 'c'])).toEqual(tabs);
  // });

});
