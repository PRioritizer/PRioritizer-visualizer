'use strict';

angular.module('visualizerApp')
  .controller('DisplayController', ['$scope', '$interpolate', '$location', '$anchorScroll', '$filter', 'jsonFactory', function ($scope, $interpolate, $location, $anchorScroll, $filter, jsonFactory) {
    /* Sort */
    $scope.defaultSort = '+timestamp';
    $scope.sortFields = getSortFields();
    $scope.activeSortFields = [];

    /* Data */
    $scope.data = jsonFactory.getData() || {};
    $scope.pullRequests = $scope.data.pullRequests || [];
    $scope.commits = $scope.data.commits || 0;
    $scope.snapshot = $scope.data.date || '';
    $scope.owner = $scope.data.owner || '';
    $scope.repository = $scope.data.repository || '';
    $scope.host = 'https://github.com';
    $scope.github = $interpolate('{{host}}/{{owner}}/{{repository}}')($scope);

    /* Calculated data */
    $scope.branches = getTargets() || [];
    $scope.filterObject = {
      target: $scope.branches[0] || ''
    };
    $scope.filteredPullRequests = [];

    /* Pagination */
    $scope.showConflictsOf = 0;
    $scope.page = 0;
    $scope.perPage = 10;

    /* Filter */
    $scope.$watch('filterObject', function (value) {
      $scope.page = 0;
      $scope.filteredPullRequests = $filter('filter')($scope.pullRequests, value, true);
    }, true);

    $scope.setFilter = function setFilter (key, value) {
      if (typeof value !== 'undefined')
        $scope.filterObject[key] = value;
      else
        delete $scope.filterObject[key];
    };

    $scope.removeFilter = function removeFilter (key) {
      $scope.setFilter(key);
    };

    $scope.getFilter = function getFilter (key) {
      return $scope.filterObject[key];
    };

    /* Sort functions */
    $scope.sort = function sort (field) {
      var direction = field.direction === '+' ? '-' : '+';
      field.direction = direction;

      if ($scope.activeSortFields.indexOf(field) === -1)
        $scope.activeSortFields.push(field);
    };

    $scope.removeSort = function removeSort (field) {
      delete field.direction;
      var index = $scope.activeSortFields.indexOf(field);

      if (index !== -1)
        $scope.activeSortFields.splice(index, 1);
    };

    $scope.getSortKeys = function getSortKeys () {
      if ($scope.activeSortFields.length === 0)
        return $scope.defaultSort;

      return $scope.activeSortFields.map(function (field) {
        return (field.direction || '+') + field.key;
      });
    };

    $scope.resetSort = function resetSort () {
      $scope.activeSortFields = [];
      $scope.sortFields.forEach(function (field) {
        delete field.direction;
      });
    };

    /* Pagination function */
    $scope.hasNextPage = function hasNextPage() {
      var maxPage = Math.ceil($scope.filteredPullRequests.length / $scope.perPage) - 1;
      return $scope.page < maxPage;
    };

    $scope.hasPreviousPage = function hasPreviousPage() {
      return $scope.page > 0;
    };

    $scope.nextPage = function nextPage() {
      if ($scope.hasNextPage())
        $scope.page = $scope.page + 1;
    };

    $scope.previousPage = function previousPage() {
      if ($scope.hasPreviousPage())
        $scope.page = $scope.page - 1;
    };

    /* Misc functions */
    $scope.branchClass = function branchClass (branch, prefix) {
      prefix = prefix || '';

      if ($scope.filterObject.target !== branch)
        return prefix + 'default';

      switch (branch) {
        case 'master':
          return prefix + 'primary';
        case 'dev':
        case 'develop':
        case 'development':
        case 'unstable':
          return prefix + 'warning';
        default:
          return prefix + 'success';
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
        return pr.target;
      });
      return targets.distinct().sort();
    }

    function getSortFields () {
      return [
        { key: 'timestamp', class: 'group1', name: 'Date', plus: 'Oldest to newest', min: 'Newest to oldest' },
        { key: 'numConflicts', class: 'group2', name: 'Conflicts', plus: 'Smallest to largest', min: 'Largest to smallest' },
        { class: 'spacer' },
        { key: 'contributor', class: 'group3', name: 'Contributor', plus: 'Unknown to known', min: 'Known to unknown' },
        { key: 'ratioPullRequests', class: 'group3', name: 'History', plus: 'Negative to positive', min: 'Positive to negative' },
        { class: 'spacer' },
        { key: 'lines', class: 'group4', name: 'Lines', plus: 'Smallest to largest', min: 'Largest to smallest' },
        { key: 'files', class: 'group4', name: 'Files', plus: 'Smallest to largest', min: 'Largest to smallest' },
        { key: 'commits', class: 'group4', name: 'Commits', plus: 'Smallest to largest', min: 'Largest to smallest' }
      ];
    }
  }]);
