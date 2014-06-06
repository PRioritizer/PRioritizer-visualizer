'use strict';

angular.module('visualizerApp')
  .controller('ReadController', ['$scope', '$upload', '$location', 'jsonFactory', function ($scope, $upload, $location, jsonFactory) {
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
      $scope.message = 'Reading input file...';
      jsonFactory.readFile(file, function() {
        $location.path('/display/');
        $scope.$apply();
      });
    };
  }]);
