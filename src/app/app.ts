/// <reference path="../types/types.ts"/>

var modules = [
  "templates",

  "ngBoilerplate.home",

  "ui.router.state"
];

var appModule = angular.module("ngBoilerplate", modules);
appModule.config(appConfig);

/* @ngInject */
function appConfig($urlRouterProvider: ng.ui.IUrlRouterProvider) {
  $urlRouterProvider.otherwise("/home");
}
