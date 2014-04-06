/// <reference path="../types.ts"/>

var modules = [
  'ui.router.state'
];

var home = angular.module('ngBoilerplate.home', modules);

var homeConfig = function($stateProvider:ng.ui.IStateProvider) {
  $stateProvider.state('home', {
    url: '/home',
    views: {
      main: {
        controller: 'HomeController',
        templateUrl: 'home/index.html'
      }
    },
    data: {
      pageTitle: 'Home'
    }
  });
};

homeConfig.$inject = ['$stateProvider'];
home.config(homeConfig);

class HomeController {
  static $inject = [
    '$scope'
  ];

  constructor(private $scope: ng.IScope) {
    console.log('hello');
  }
}

home.controller('HomeController', HomeController);
