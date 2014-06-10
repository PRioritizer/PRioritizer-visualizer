'use strict';

angular.module('visualizerApp')
  .controller('DisplayController', ['$scope', 'jsonFactory', function ($scope, jsonFactory) {
    $scope.sortOrder = false;
    $scope.sortFunc = $scope.onNumber;
    $scope.pullRequests = jsonFactory.getData();
    $scope.branches = getTargets();
    $scope.selectedBranch = $scope.branches[0] || '';

    $scope.sort = function sort (on) {
      if ($scope.sortFunc === on) {
        $scope.sortOrder = !$scope.sortOrder;
      } else {
        $scope.sortFunc = on;
        $scope.sortOrder = false;
      }
    };

    $scope.branchClass = function branchClass (branch, prefix) {
      prefix = prefix || '';
      switch (branch) {
        case 'master':
          return prefix + 'primary';
        case 'dev':
        case 'develop':
        case 'development':
          return prefix + 'warning';
        default:
          return prefix + 'default';
      }
    };

    /* Private functions */
    function getTargets() {
      if (!angular.isArray($scope.pullRequests))
        return [];

      var targets = $scope.pullRequests.map(function (pr) {
        return pr.target.toLowerCase();
      });
      return targets.distinct().sort();
    }

    /* Sort functions */
    $scope.onDate = function onDate (pr) {
      return Date.parse(pr.createdAt);
    };

    $scope.onNumber = function onNumber (pr) {
      return pr.number;
    };

    $scope.onNumberConflicts = function onNumberConflicts (pr) {
      return pr.conflictsWith.length;
    };

    $scope.onContributor = function onContributor (pr) {
      return pr.contributorIndex;
    };

    $scope.onSize = function onSize (dimension) {
      switch(dimension) {
        case 'lines':
          return $scope.onLines;
        case 'files':
          return $scope.onFiles;
        case 'commits':
          return $scope.onCommits;
        default:
          return function () {};
      }
    };

    $scope.onLines = function onLines (pr) {
      return pr.linesAdded + pr.linesDeleted;
    };

    $scope.onFiles = function onFiles (pr) {
      return pr.filesChanged;
    };

    $scope.onCommits = function onCommits (pr) {
      return pr.commits;
    };
  }]);
