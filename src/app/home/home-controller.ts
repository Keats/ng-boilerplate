/// <reference path="../../types/types.ts"/>

class HomeController {
  /* @ngInject */
  constructor(private $scope: core.IScope, private $rootScope: core.IRootScope) {
    $scope.vm = this;
    $rootScope.pageTitle = "Home";
  }
}

angular
  .module("home.index", [])
  .controller("HomeController", HomeController);
