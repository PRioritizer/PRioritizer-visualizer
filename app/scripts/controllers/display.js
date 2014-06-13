'use strict';

angular.module('visualizerApp')
  .controller('DisplayController', ['$scope', '$interpolate', 'jsonFactory', function ($scope, $interpolate, jsonFactory) {
    $scope.linesResolution = 6;
    $scope.chartResolution = 20;
    $scope.maxConflicts = 10;
    $scope.defaultSort = '+timestamp';
    $scope.sortOn = [];
    $scope.data = jsonFactory.getData() || {};
    $scope.pullRequests = $scope.data.pullRequests || [];
    $scope.branches = getTargets() || [];
    $scope.commits = getContributorCommits() || 0;
    $scope.selectedBranch = $scope.branches[0] || '';
    $scope.snapshot = $scope.data.date || '';
    $scope.owner = $scope.data.owner || '';
    $scope.repository = $scope.data.repository || '';
    $scope.host = 'https://github.com';
    $scope.github = $interpolate('{{host}}/{{owner}}/{{repository}}')($scope);

    $scope.sort = function sort (on) {
      var field = on.substr(1);
      var newField = true;

      for (var i = $scope.sortOn.length - 1; i >= 0; i--) {
        if ($scope.sortOn[i].substr(1) === field) {
          $scope.sortOn[i] = on;
          newField = false;
          break;
        }
      }

      if (newField)
        $scope.sortOn.push(on);
    };

    $scope.getSort = function getSort () {
      return $scope.sortOn.length > 0 ? $scope.sortOn : $scope.defaultSort;
    };

    $scope.resetSort = function resetSort () {
      $scope.sortOn = [];
    };

    $scope.indexSort = function indexSort (field) {
      for (var i = $scope.sortOn.length - 1; i >= 0; i--)
        if ($scope.sortOn[i].substr(1) === field)
          return i + 1;
      return 0;
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

    function getContributorCommits() {
      if (!angular.isArray($scope.pullRequests))
        return 0;

      var authors = [];
      var sum = 0;

      /* Sum commits of distinct authors */
      for (var i = $scope.pullRequests.length - 1; i >= 0; i--) {
        var pr = $scope.pullRequests[i];
        if (authors.indexOf(pr.author) !== -1)
          continue;
        sum += pr.contributedCommits;
        authors.push(pr.author);
      }

      return Math.max(sum, $scope.chartResolution);
    }
  }]);
