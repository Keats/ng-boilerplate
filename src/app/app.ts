/// <reference path="../types/types.ts"/>


/* @ngInject */
function appConfig($urlRouterProvider: ng.ui.IUrlRouterProvider) {
  $urlRouterProvider.otherwise("/home");
}

angular
  .module("ngBoilerplate", [
    "templates",
    "ngBoilerplate.home",
    "ui.router.state"
  ])
  .config(appConfig);
