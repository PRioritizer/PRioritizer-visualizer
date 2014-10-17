'use strict';

angular.module('visualizerApp')
  .controller('DisplayController', ['$scope', '$interpolate', '$location', '$anchorScroll', '$filter', '$routeParams', 'jsonFactory', function ($scope, $interpolate, $location, $anchorScroll, $filter, $routeParams, jsonFactory) {
    /* Sort */
    $scope.defaultSort = ['-important'];
    $scope.defaultFilter = {};
    $scope.sortFields = [];
    $scope.filterFields = [];
    $scope.activeSortFields = [];

    /* Data */
    $scope.data = {};
    $scope.pullRequests = [];
    $scope.commits = 0;
    $scope.snapshot = '';
    $scope.owner = '';
    $scope.repository = '';
    $scope.branches = [];
    $scope.filterObject = {};
    $scope.filteredPullRequests = [];
    $scope.host = 'https://github.com';
    $scope.github = $scope.host;
    $scope.numImportant = 5;
    $scope.importantThreshold = 0;

    /* Load pull requests */
    var ready = jsonFactory.getData($routeParams.owner, $routeParams.repo);
    ready.then(function (data)
    {
      $scope.data = data;
      $scope.pullRequests = $scope.data.pullRequests;
      $scope.filteredPullRequests = $scope.pullRequests;
      $scope.commits = $scope.data.commits;
      $scope.snapshot = $scope.data.date;
      $scope.owner = $scope.data.owner;
      $scope.repository = $scope.data.repository;
      $scope.branches = getTargets();
      $scope.github = $scope.host + '/' + $scope.owner + '/' + $scope.repository;

      $scope.numImportant = window.Math.min($scope.numImportant, $scope.pullRequests.length);
      if ($scope.numImportant > 0) {
        var sortedPrs = $filter('orderBy')($scope.pullRequests, '-important');
        $scope.importantThreshold = sortedPrs[$scope.numImportant-1].important;
      }

      $scope.sortFields = getSortFields();
      $scope.filterFields = getFilterFields();
    });

    /* Pagination */
    $scope.showConflictsOf = 0;
    $scope.page = 0;
    $scope.perPage = 10;

    /* Math */
    $scope.min = window.Math.min;
    $scope.max = window.Math.max;

    /* Feedback */
    $scope.showSendFeedback = true;

    /* Analytics */
    track();

    /* Filter */
    $scope.$watch('filterObject', function (value) {
      $scope.page = 0;
      var filter = angular.copy(value);
      $scope.filteredPullRequests = $filter('filter')($scope.pullRequests, filter, true);
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

    $scope.hasFilter = function hasFilter (key) {
      if (typeof key === 'undefined')
        return Object.keys($scope.filterObject).length > 0;
      return typeof $scope.getFilter(key) !== 'undefined';
    };

    $scope.toggleFilter = function toggleFilter (key, value) {
      if ($scope.getFilter(key) !== value) {
        $scope.setFilter(key, value);
      } else {
        $scope.removeFilter(key);
      }
    };

    $scope.resetFilter = function resetFilter () {
      $scope.filterObject = $scope.defaultFilter;
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
      }).concat($scope.defaultSort);
    };

    $scope.getSort = function getSort (field, direction) {
      if (typeof direction !== 'undefined' && field.direction !== direction)
        return -1;
      return $scope.activeSortFields.indexOf(field);
    };

    $scope.hasSort = function hasSort (field, direction) {
      if (typeof field === 'undefined')
        return $scope.activeSortFields.length > 0;
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

    $scope.sendFeedback = function sendFeedback (pr, important, $event) {
      var category = $scope.owner + '/' + $scope.repository;
      var action = important ? 'important' : 'unimportant';
      var label = '' + pr.number;
      var value = window.Math.round(pr.important * 1000);

      var el = jQuery($event.target).parent();
      el.hide();
      el.next().show();

      ga('send', 'event', category, action, label, value);
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

    function getFilterFields () {
      var branches = $scope.branches.map(function(b) { return { name: b, value: b}; });
      return [
        { key: 'target', name: 'Branch', values: branches },
        { key: 'isMergeable', name: 'Mergeable', values: [ { name : 'Mergeable', value: true }, { name : 'Conflicted', value: false } ] },
        { key: 'coreMember',  name: 'Author',    values: [ { name : 'Core member', value: true }, { name : 'Non-member', value: false } ] },
      ];
    }

    function track() {
      var path = $location.path();
      ga('send', 'pageview', {'page': path});
    }
  }]);
