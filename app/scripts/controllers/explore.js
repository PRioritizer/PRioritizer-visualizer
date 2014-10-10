'use strict';

angular.module('visualizerApp')
  .controller('ExploreController', ['$scope', '$upload', '$location', '$http', 'jsonFactory', function ($scope, $upload, $location, $http, jsonFactory) {
    $scope.fileApiSupport = jsonFactory.fileApiSupport;
    $scope.repos = [];
    $scope.perColumn = 0;

    jsonFactory.init
      .success(function() {
        $scope.repos = jsonFactory.repositories;
        $scope.perColumn = Math.ceil($scope.repos.length / 3);
      });

    track();

    $scope.onFileClick = function onFileClick(repo) {
      $location.path('/display/' + repo.owner + '/' + repo.repo);
    };

    function track() {
      ga('send', 'pageview', {'page': $location.path()});
    }
  }]);
