'use strict';

angular.module('visualizerApp')
  .controller('PullRequestController', ['$scope', '$location', '$anchorScroll', function ($scope, $location, $anchorScroll) {
    $scope.maxConflicts = 10;

    $scope.getConflicts = function getConflicts(pr) {
      return pr.conflictsWith.join(' ');
    };

    $scope.getPercentageAdded = function getPercentageAdded(pr, resolution) {
      resolution = resolution || 100;
      var part = pr.linesAdded / (pr.linesAdded + pr.linesDeleted) || 0;
      var round = part > (1 / resolution) ? Math.floor : Math.ceil;
      return round(part * resolution) * (100 / resolution);
    };

    $scope.getPart = function getPart(part, resolution) {
      part = part || 0;
      resolution = resolution || 10;
      return Math.ceil(part * resolution) + '/' + resolution;
    };

    $scope.scrollTo = function scrollTo (id) {
      var old = $location.hash();
      $location.hash(id);
      $anchorScroll();
      //reset to old to keep any additional routing logic from kicking in
      $location.hash(old);
    };
  }]);
