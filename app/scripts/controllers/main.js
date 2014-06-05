'use strict';

angular.module('visualizerApp')
  .controller('MainController', ['$scope', '$interpolate', '$upload', function ($scope, $interpolate, $upload) {
    $scope.message = null;
    $scope.file = null;
    $scope.data = null;
    $scope.fileApiSupport = window.File && window.FileReader && window.FileList && window.Blob;

    $scope.selectFile = function selectFile() {
      if (!$scope.fileApiSupport)
        return;

      angular.element('#selectedFile').click();
    };

    $scope.onFileSelect = function onFileSelect(files) {
      if (!$scope.fileApiSupport || files.length === 0)
        return;

      if (!files[0].name.endsWith('.json')) {
        $scope.message = "Select a JSON file.";
        return;
      }

      $scope.file = files[0];
      readFile();
    };

    function readFile() {
      if (!$scope.fileApiSupport || $scope.file === null)
        return;

      console.log($scope.file);
      $scope.message = $interpolate('Reading {{file.name}}...')($scope);

      var file = $scope.file;
      var reader = new FileReader();

      reader.onload = function(e) {
        $scope.data = e.target.result;
        $scope.message = 'Done';
        $scope.$apply();
      };
      reader.readAsText(file);
    };
  }]);
