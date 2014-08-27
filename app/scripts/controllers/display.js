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

    $scope.toggleFilter = function toggleFilter (key, value) {
      if ($scope.getFilter(key) !== value) {
        $scope.setFilter(key, value);
      } else {
        $scope.removeFilter(key);
      }
    };

    /* Sort functions */
    $scope.sort = function sort (field, direction) {
      direction = direction || (field.direction === '+' ? '-' : '+');
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

    $scope.getSort = function getSort (field, direction) {
      if (typeof(direction) !== 'undefined' && field.direction !== direction)
        return -1;
      return $scope.activeSortFields.indexOf(field);
    };

    $scope.hasSort = function hasSort (field, direction) {
      return $scope.getSort(field, direction) !== -1;
    };

    $scope.toggleSort = function toggleSort (field, direction) {
      if (!$scope.hasSort(field, direction)) {
        $scope.sort(field, direction);
      } else {
        $scope.removeSort(field);
      }
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
        { key: 'timestamp', asc: 'Oldest', desc: 'Newest' },
        { key: 'lines', asc: 'Smallest', desc: 'Largest' },
        { key: 'allComments', asc: 'Least commented', desc: 'Most commented' },
        { key: 'numConflicts', asc: 'Least conflicts', desc: 'Most conflicts' },
        { key: 'contributor', asc: 'Least contributed', desc: 'Most contributed' },
        { key: 'ratioPullRequests', asc: 'Worst accept rate', desc: 'Best accept rate' }
      ];
    }
  }]);
