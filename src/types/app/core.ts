/// <reference path="../libs/angular.d.ts"/>

declare module core {

  interface IRootScope extends ng.IScope {
    pageTitle: string;
  }

  // Only add interfaces for the things shared or used in other modules
  interface IGreeting {
    greeting: string;
  }

  interface IHomeService {
    getGreeting(greeting: string): IGreeting;
  }
}
