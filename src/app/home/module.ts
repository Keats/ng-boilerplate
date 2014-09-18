/// <reference path="../../types/types.ts"/>


/* @ngInject */
function homeConfig($stateProvider: ng.ui.IStateProvider) {
  $stateProvider.state("home", {
    url: "/home",
    controller: "HomeController as vm",
    templateUrl: "home/index.html"
  });
}

angular
  .module("ngBoilerplate.home", [
    "home.index",
    "home.directives",
    "ui.router.state"
  ])
  .config(homeConfig);
