/// <reference path="../../types/types.ts" />

function postfix(): ng.IDirective {
    var link = function(
      scope: ng.IScope,
      element: ng.IAugmentedJQuery,
      attrs: ng.IAttributes,
      controller: any
    ) {
      var postfixValue = attrs["ngbPostfix"];

      var format = (value) => {
        return value + " " + postfixValue;
      };

      var parse = (value) => {
        // it will start with a number supposedly, parseFloat itself
        // should do the trick
        var numberValue = parseFloat(value) || 0;
        controller.$setViewValue(format(numberValue));
        controller.$render();
        return numberValue;
      };

      controller.$formatters.push(format);
      controller.$parsers.push(parse);
    };

    return {
      restrict: "A",
      require: "ngModel",
      link: link
    };
  }

angular
  .module("home.directives", [])
  .directive("ngbPostfix", postfix);
