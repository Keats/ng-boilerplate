/// <reference path="../../types/types.ts"/>


class HomeController implements core.IHomeController {
  greeting: string;

  /* @ngInject */
  constructor(private $rootScope: core.IRootScope) {
    $rootScope.pageTitle = "Hello";
    this.greeting = "hello";
  }
}

angular
  .module("home.index", [])
  .controller("HomeController", HomeController);
