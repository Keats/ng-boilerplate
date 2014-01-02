
modules = [
  'templates',

  'ngBoilerplate.home',

  'ui.router.state'
]

appModule = angular.module('ngBoilerplate', modules)


appConfig = ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise '/home'

appConfig.$inject = ['$stateProvider', '$urlRouterProvider']
appModule.config appConfig


appController = ($scope, $location) ->
  $scope.$on '$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) ->
    if angular.isDefined(toState.data.pageTitle)
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate'

appController.$inject = ['$scope', '$location']
appModule.controller 'AppCtrl', appController
