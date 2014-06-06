'use strict';

angular.module('visualizerApp')
  .controller('HeaderController', ['$scope', '$route', function ($scope, $route) {
    $scope.route = $route;
    $scope.activetab = null;

    $scope.$watch('route.current', function (newVal, oldVal, scope) {
      if(newVal.activetab)
        scope.activetab = newVal.activetab;
    });
  }]);
