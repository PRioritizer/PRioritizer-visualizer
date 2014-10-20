'use strict';

angular.module('visualizerApp')
  .controller('ExploreController', ['$scope', '$upload', '$location', '$http', '$timeout', 'jsonFactory', function ($scope, $upload, $location, $http, $timeout, jsonFactory) {
    $scope.fileApiSupport = jsonFactory.fileApiSupport;
    $scope.repos = [];
    $scope.perColumn = 0;

    jsonFactory.init
      .success(function() {
        $scope.repos = jsonFactory.repositories.map(function(r) { return { owner: r.owner, repo: r.repo }; });
        $scope.perColumn = Math.ceil($scope.repos.length / 3);
      });

    track();

    $scope.onFileClick = function onFileClick(repo) {
      $location.path('/display/' + repo.owner + '/' + repo.repo);
    };

    $scope.openProject = function openProject() {
      $timeout(function() {
        angular.element('.projects a').eq(0).trigger('click');
      });
    };

    function track() {
      ga('send', 'pageview', {'page': $location.path()});
    }
  }]);
