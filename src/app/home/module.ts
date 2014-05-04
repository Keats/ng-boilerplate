/// <reference path="../../types/types.ts"/>

var modules = [
  "home.index",

  "ui.router.state"
];

var home = angular.module("ngBoilerplate.home", modules);

var homeConfig = function ($stateProvider: ng.ui.IStateProvider) {
  $stateProvider.state("home", {
    url: "/home",
    controller: "HomeController",
    templateUrl: "home/index.html"
  });
};

homeConfig.$inject = ["$stateProvider"];
home.config(homeConfig);
