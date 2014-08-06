/// <reference path="../libs/angular.d.ts"/>

declare module core {

  interface IRootScope extends ng.IScope {
    pageTitle: string;
  }

  // TODO: DELETE WHEN CLONING
  interface IHomeController {
    greeting: string;
  }
}
