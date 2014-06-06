'use strict';

angular.module('visualizerApp')
  .controller('DisplayController', ['$scope', 'jsonFactory', function ($scope, jsonFactory) {
    $scope.data = jsonFactory.getData();
  }]);
