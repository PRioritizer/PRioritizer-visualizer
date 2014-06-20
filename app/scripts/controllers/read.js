'use strict';

angular.module('visualizerApp')
  .controller('ReadController', ['$scope', '$upload', '$location', 'jsonFactory', 'pullRequestFactory', function ($scope, $upload, $location, jsonFactory, pullRequestFactory) {
    $scope.fileApiSupport = jsonFactory.fileApiSupport;
    $scope.message = null;
    $scope.file = null;

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

    function transformData(data) {
      if (angular.isArray(data.pullRequests))
        data.pullRequests = data.pullRequests.map(function (pr) { return pullRequestFactory.get(pr); });
      return data;
    }
  }]);
