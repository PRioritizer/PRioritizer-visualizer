'use strict';

angular.module('visualizerApp')
  .controller('ExploreController', ['$scope', '$upload', '$location', '$http', '$timeout', '$filter', 'jsonFactory', function ($scope, $upload, $location, $http, $timeout, $filter, jsonFactory) {
    $scope.fileApiSupport = jsonFactory.fileApiSupport;
    $scope.repos = [];
    $scope.filteredRepos = [];
    $scope.perColumn = 0;
    $scope.searchText = '';

    jsonFactory.init
      .success(function() {
        $scope.repos = jsonFactory.repositories.map(function(r) { return { owner: r.owner, repo: r.repo }; });
        $scope.filteredRepos = $scope.repos;
        $scope.perColumn = Math.ceil($scope.repos.length / 3);
      });

    track();

    /* Filter */
    $scope.$watch('searchText', function (value) {
      $scope.filteredRepos = $filter('filter')($scope.repos, {$:value});
    });

    $scope.onFileClick = function onFileClick(repo) {
      $location.path('/display/' + repo.owner + '/' + repo.repo);
    };

    $scope.openProject = function openProject() {
      if ($scope.filteredRepos.length > 0) {
        $scope.onFileClick($scope.filteredRepos[0]);
      }
    };

    function track() {
      ga('send', 'pageview', {'page': $location.path()});
    }
  }]);
