'use strict';

angular.module('visualizerApp')
  .controller('PullRequestController', ['$scope', '$location', '$anchorScroll', function ($scope, $location, $anchorScroll) {
    $scope.linesResolution = 6;
    $scope.chartResolution = 20;

    $scope.getPercentage = function getPercentage (part, resolution) {
      part = isFinite(part) ? part : 0;
      resolution = resolution || $scope.linesResolution;
      var round = part > (1 / resolution) ? Math.floor : Math.ceil;
      return round(part * resolution) * (100 / resolution);
    };

    $scope.getPart = function getPart (part, resolution) {
      part = isFinite(part) ? part : 0;
      resolution = resolution || $scope.chartResolution;
      var round = part > (1 / resolution) ? Math.floor : Math.ceil;
      return round(part * resolution) + '/' + resolution;
    };

    $scope.scrollTo = function scrollTo (id) {
      var old = $location.hash();
      $location.hash(id);
      $anchorScroll();
      //reset to old to keep any additional routing logic from kicking in
      $location.hash(old);
    };
  }]);
