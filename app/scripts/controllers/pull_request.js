'use strict';

angular.module('visualizerApp')
  .controller('PullRequestController', ['$scope', '$location', '$anchorScroll', function ($scope, $location, $anchorScroll) {
    $scope.getConflicts = function getConflicts(pr) {
      return pr.conflictsWith.join(' ');
    };

    $scope.scrollTo = function scrollTo (id) {
      var old = $location.hash();
      $location.hash(id);
      $anchorScroll();
      //reset to old to keep any additional routing logic from kicking in
      $location.hash(old);
    };
  }]);
