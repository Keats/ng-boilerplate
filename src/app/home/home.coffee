
modules = [
  'ui.router.state',
]

angular.module("ngBoilerplate.home", modules).config(config = ($stateProvider) ->
  $stateProvider.state "home",
    url: "/home"
    views:
      main:
        controller: "HomeCtrl"
        templateUrl: "home/home.html"

    data:
      pageTitle: "Home"

).controller "HomeCtrl", HomeController = ($scope) ->
