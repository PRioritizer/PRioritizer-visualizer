'use strict';

angular.module('visualizerApp')
  .controller('DisplayController', ['$scope', '$interpolate', '$location', '$anchorScroll', 'jsonFactory', function ($scope, $interpolate, $location, $anchorScroll, jsonFactory) {
    $scope.defaultSort = '+timestamp';
    $scope.sortGroups = getSortFields();
    $scope.selectedSortGroup = null;
    $scope.selectedSortField = null;
    $scope.sortFields = [];
    $scope.data = jsonFactory.getData() || {};
    $scope.pullRequests = $scope.data.pullRequests || [];
    $scope.branches = getTargets() || [];
    $scope.commits = $scope.data.commits || 0;
    $scope.selectedBranch = $scope.branches[0] || '';
    $scope.snapshot = $scope.data.date || '';
    $scope.owner = $scope.data.owner || '';
    $scope.repository = $scope.data.repository || '';
    $scope.host = 'https://github.com';
    $scope.github = $interpolate('{{host}}/{{owner}}/{{repository}}')($scope);
    $scope.showConflictsOf = 0;

    /* Sort functions */
    $scope.sort = function sort (field, direction) {
      direction = direction || '+';
      field.direction = direction;

      if ($scope.sortFields.indexOf(field) === -1)
        $scope.sortFields.push(field);
    };

    $scope.removeSort = function removeSort (field) {
      var index = $scope.sortFields.indexOf(field);

      if (index !== -1)
        $scope.sortFields.splice(index, 1);
    };

    $scope.getSortKeys = function getSortKeys () {
      if ($scope.sortFields.length === 0)
        return $scope.defaultSort;

      return $scope.sortFields.map(function (field) {
        return (field.direction || '+') + field.key;
      });
    };

    $scope.resetSort = function resetSort () {
      $scope.sortFields = [];
    };

    $scope.setSortSelection = function setSortSelection (group, field) {
      group = group || null;
      field = field || null;
      $scope.selectedSortGroup = group;
      $scope.selectedSortField = field;
    };

    $scope.resetSortSelection = function resetSortSelection () {
      $scope.setSortSelection();
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

    $scope.getPart = function getPart (part, resolution) {
      part = isFinite(part) ? part * resolution : 0;
      resolution = resolution || 100;
      var round = (part < 1) ? Math.ceil : (part > resolution-1) ? Math.floor : Math.round;
      return round(part);
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

    function getSortFields () {
      return [
        {
          group: 'Age',
          fields: [
            { key: 'timestamp', name: 'Date', plus: 'Oldest to newest', min: 'Newest to oldest' }
          ]
        },
        {
          group: 'Size',
          fields: [
            { key: 'lines', name: 'Lines', plus: 'Smallest to largest', min: 'Largest to smallest' },
            { key: 'files', name: 'Files', plus: 'Smallest to largest', min: 'Largest to smallest' },
            { key: 'commits', name: 'Commits', plus: 'Smallest to largest', min: 'Largest to smallest' }
          ]
        },
        {
          group: 'Author',
          fields: [
            { key: 'coreMember', name: 'Member', plus: 'Non-members to members', min: 'Members to non-members' },
            { key: 'contributor', name: 'Contributor', plus: 'Unknown to known', min: 'Known to unknown' },
            { key: 'ratioPullRequests', name: 'History', plus: 'Negative to positive', min: 'Positive to negative' }
          ]
        },
        {
          group: 'Conflicts',
          fields: [
            { key: 'isMergeable', name: 'Mergeable', plus: 'Conflicted to mergeable', min: 'Mergeable to conflicted' },
            { key: 'numConflicts', name: 'Pairwise', plus: 'Smallest to largest', min: 'Largest to smallest' }
          ]
        }
      ];
    }
  }]);
