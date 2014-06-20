'use strict';

angular.module('visualizerApp')
  .controller('DisplayController', ['$scope', '$interpolate', '$location', '$anchorScroll', 'jsonFactory', function ($scope, $interpolate, $location, $anchorScroll, jsonFactory) {
    $scope.defaultSort = '+timestamp';
    $scope.sortFields = getSortFields();
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
    $scope.showConflictsOf = 0;
    $scope.linesResolution = 6;
    $scope.chartResolution = 20;

    /* Sort functions */
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

    $scope.removeSort = function removeSort (on) {
      var index = $scope.indexSort(on);

      if (index === -1)
        return;

      $scope.sortOn.splice(index, 1);
    };

    $scope.getSort = function getSort () {
      return $scope.sortOn.length > 0 ? $scope.sortOn : $scope.defaultSort;
    };

    $scope.resetSort = function resetSort () {
      $scope.sortOn = [];
    };

    $scope.indexSort = function indexSort (field) {
      var hasSign = field.startsWith('+') || field.startsWith('-');
      for (var i = $scope.sortOn.length - 1; i >= 0; i--)
        if ((!hasSign && trimField($scope.sortOn[i]) === field) || ($scope.sortOn[i] === field))
          return i;
      return -1;
    };

    /* Misc functions */
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

    $scope.showConflicts = function showConflicts (pr) {
      if ($scope.showConflictsOf === pr.number)
        $scope.showConflictsOf = 0;
      else
        $scope.showConflictsOf = pr.number;
    };

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

      return sum;
    }

    function trimField (field) {
      var sign = field.startsWith('+') || field.startsWith('-');
      return sign ? field.substr(1) : field;
    }

    function getSortFields () {
      return [
        { name: 'Date', key: 'timestamp', plus: 'Oldest first', min: 'Newest first' },
        { name: 'Conflicts', key: 'numConflicts', plus: 'Less first', min: 'More first' },
        { name: 'Lines', key: 'lines', plus: 'Less first', min: 'More first' },
        { name: 'Files', key: 'files', plus: 'Less first', min: 'More first' },
        { name: 'Commits', key: 'commits', plus: 'Less first', min: 'More first' },
        { name: 'Contributor', key: 'contributor', plus: 'Unknown first', min: 'Known first' },
        { name: 'History', key: 'ratioPullRequests', plus: 'Negative first', min: 'Positive first' },
        { name: 'Mergeable', key: 'isMergeable', plus: 'Conflicted first', min: 'Mergeable first' }
      ];
    }
  }]);
