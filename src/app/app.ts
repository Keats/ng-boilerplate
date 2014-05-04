/// <reference path="../types/types.ts"/>

var modules = [
  "templates",

  "ngBoilerplate.home",

  "ui.router.state"
];

var appModule = angular.module("ngBoilerplate", modules);

var appConfig = function ($urlRouterProvider: ng.ui.IUrlRouterProvider) {
  $urlRouterProvider.otherwise("/home");
};

appConfig.$inject = ["$urlRouterProvider"];
appModule.config(appConfig);
