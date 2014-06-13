'use strict';

angular.module('visualizerApp')
  .controller('DisplayController', ['$scope', '$interpolate', 'jsonFactory', function ($scope, $interpolate, jsonFactory) {
    $scope.sortOrder = false;
    $scope.sortFunc = $scope.onNumber;
    $scope.data = jsonFactory.getData() || {};
    $scope.pullRequests = $scope.data.pullRequests || [];
    $scope.branches = getTargets() || [];
    $scope.selectedBranch = $scope.branches[0] || '';
    $scope.snapshot = $scope.data.date || '';
    $scope.owner = $scope.data.owner || '';
    $scope.repository = $scope.data.repository || '';
    $scope.host = 'https://github.com';
    $scope.github = $interpolate('{{host}}/{{owner}}/{{repository}}')($scope);

    $scope.sort = function sort (on, order) {
      if ($scope.sortFunc === on) {
        $scope.sortOrder = !$scope.sortOrder;
      } else {
        $scope.sortFunc = on;
        $scope.sortOrder = !!order;
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

    $scope.onNumberConflicts = function onNumberConflicts (pr) {
      return pr.conflictsWith.length;
    };

    $scope.onContributor = function onContributor (pr) {
      return pr.contributorIndex;
    };

    $scope.onPrevPullRequests = function onPrevPullRequests (pr) {
      return pr.acceptedPullRequests/pr.totalPullRequests || 0;
    };

    $scope.onMergeable = function onMergeable (pr) {
      return pr.isMergeable;
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
