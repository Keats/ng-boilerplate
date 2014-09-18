/// <reference path="../../types/types.ts"/>

class HomeService implements core.IHomeService {
  private logGreeting(greeting: string) {
    console.log("Received greeting: " + greeting);
  }

  getGreeting(greeting) {
    this.logGreeting(greeting);
    // do something else
    return {"greeting": greeting};
  }
}


angular
  .module("home.services", [])
  .service("HomeService", HomeService);
