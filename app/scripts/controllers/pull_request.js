'use strict';

angular.module('visualizerApp')
  .controller('PullRequestController', ['$scope', '$location', '$anchorScroll', function ($scope, $location, $anchorScroll) {
    $scope.getConflicts = function getConflicts(pr) {
      return pr.conflictsWith.join(' ');
    };

    $scope.getPercentageAdded = function getConflicts(pr, parts) {
      parts = parts || 100;
      return Math.floor(pr.linesAdded * parts / (pr.linesAdded + pr.linesDeleted)) * (100/parts);
    };

    $scope.scrollTo = function scrollTo (id) {
      var old = $location.hash();
      $location.hash(id);
      $anchorScroll();
      //reset to old to keep any additional routing logic from kicking in
      $location.hash(old);
    };
  }]);
