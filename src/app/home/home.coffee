
modules = [
  'ui.router.state',
]

angular.module("ngBoilerplate.home", modules).config(['$stateProvider', ($stateProvider) ->
  $stateProvider.state "home",
    url: "/home"
    views:
      main:
        controller: "HomeCtrl"
        templateUrl: "home/home.html"

    data:
      pageTitle: "Home"

]).controller "HomeCtrl", ['$scope', ($scope) ->
]
