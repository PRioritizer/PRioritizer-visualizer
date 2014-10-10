'use strict';

angular.module('visualizerApp')
  .controller('ExploreController', ['$scope', '$upload', '$location', '$http', 'jsonFactory', 'pullRequestFactory', function ($scope, $upload, $location, $http, jsonFactory, pullRequestFactory) {
    $scope.fileApiSupport = jsonFactory.fileApiSupport;
    $scope.message = null;
    $scope.file = null;
    $scope.repos = [];
    $scope.perColumn = 0;

    getRepositories();
    track();

    $scope.selectFile = function selectFile() {
      if (!$scope.fileApiSupport)
        return;

      angular.element('#selectedFile').click();
    };

    $scope.onFileSelect = function onFileSelect(files) {
      if (!$scope.fileApiSupport || files.length === 0)
        return;

      var file = files[0];
      if (!file.name.endsWith('.json')) {
        $scope.message = 'Only JSON files are supported.';
        return;
      }

      $scope.file = file;
      $scope.message = 'Reading JSON file...';
      jsonFactory.readFile(file, function success(data) {
        transformData(data);
        $location.path('/display/');
        $scope.$apply();
      }, function error(err) {
        $scope.message = 'Could not read JSON file: ' + err.message;
        $scope.$apply();
      });
    };

    $scope.onFileClick = function onFileClick(repo) {
      $scope.file = repo.file;
      $scope.message = 'Reading JSON file...';
      $http.get('json/' + repo.file).
        success(function(data) {
          transformData(data);
          jsonFactory.setData(data);
          $location.path('/display/');
        }).
        error(function(data, status) {
          $scope.message = 'Could not read JSON file: ' + status;
          $scope.$apply();
        });
    };

    function transformData(data) {
      if (angular.isArray(data.pullRequests))
        data.pullRequests = data.pullRequests.map(function (pr) { return pullRequestFactory.get(pr); });
      return data;
    }

    function getRepositories() {
      $http.get('json/index.json').
        success(function(data) {
          $scope.repos = data;
          $scope.perColumn = Math.ceil($scope.repos.length / 3);
        }).
        error(function(data, status) {
          $scope.message = 'Could not read JSON index: ' + status;
        });
    }

    function track() {
      ga('send', 'pageview', {'page': $location.path()});
    }
  }]);
