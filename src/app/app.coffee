
modules = [
  'templates-app',
  'templates-common',

  'ngBoilerplate.home',

  'ui.router.state'
]

appModule = angular.module('ngBoilerplate', modules)

appModule.config(config = ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise '/home'
)

appModule.controller 'AppCtrl', AppCtrl = ($scope, $location) ->
  $scope.$on '$stateChangeSuccess', (
    event, toState, toParams, fromState, fromParams
  ) ->
    if angular.isDefined(toState.data.pageTitle)
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate'
