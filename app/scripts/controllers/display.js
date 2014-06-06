'use strict';

angular.module('visualizerApp')
  .controller('DisplayController', ['$scope', 'jsonFactory', function ($scope, jsonFactory) {
    $scope.pullRequests = jsonFactory.getData();

    $scope.sort = function sort (on) {
      var data = jsonFactory.getData();
      var func = function(a, b) {
        a = on(a);
        b = on(b);
        if (a === b)
          return 0;

        return a > b ? 1 : -1;
      };

      $scope.pullRequests = data.sort(func);
    };

    $scope.onDate = function onDate (pr) {
      return pr.createdAt;
    };

    $scope.onNumber = function onNumber (pr) {
      return pr.number;
    };

    $scope.onNumberConflicts = function onNumberConflicts (pr) {
      return pr.conflictsWith.length;
    };
  }]);
