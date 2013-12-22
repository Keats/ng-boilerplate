
modules = [
  'ui.router.state',
]

home = angular.module 'ngBoilerplate.home', modules

home.config ['$stateProvider', ($stateProvider) ->
  $stateProvider.state "home",
    url: "/home"
    views:
      main:
        controller: "HomeCtrl"
        templateUrl: "home/index.html"

    data:
      pageTitle: "Home"
]

home.controller "HomeCtrl", ['$scope', ($scope) ->
]
