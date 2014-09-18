/// <reference path="../../types/types.ts"/>


class HomeController {
  greeting: string;
  times: number;

  /* @ngInject */
  constructor(
    private $rootScope: core.IRootScope,
    private HomeService: core.IHomeService
  ) {
    $rootScope.pageTitle = "Hello";
    this.times = 1;
    this.greeting = HomeService.getGreeting("Hello").greeting;
  }
}

angular
  .module("home.index", [
    "home.services"
  ])
  .controller("HomeController", HomeController);
