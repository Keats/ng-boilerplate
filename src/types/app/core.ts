/// <reference path="../libs/angular.d.ts"/>

declare module core {

  interface IRootScope extends ng.IScope {
    pageTitle: string;
  }

  interface IScope extends ng.IScope {
    vm: any;
  }

}
