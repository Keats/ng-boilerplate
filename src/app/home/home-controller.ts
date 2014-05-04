/// <reference path="../../types/types.ts"/>

var home = angular.module("home.index", []);

class HomeController {
  static $inject = [
    "$scope",
    "$rootScope"
  ];

  constructor(
    private $scope: core.IScope,
    private $rootScope: core.IRootScope
  ) {
    $scope.vm = this;
    $rootScope.pageTitle = 'Home';
  }
}

home.controller("HomeController", HomeController);
