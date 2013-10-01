
modules = [
  'templates',

  'ngBoilerplate.home',

  'ui.router.state'
]

appModule = angular.module('ngBoilerplate', modules)

appModule.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise '/home'
])

appModule.controller 'AppCtrl', ['$scope', '$location', ($scope, $location) ->
  $scope.$on '$stateChangeSuccess', (
    event, toState, toParams, fromState, fromParams
  ) ->
    if angular.isDefined(toState.data.pageTitle)
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate'
]