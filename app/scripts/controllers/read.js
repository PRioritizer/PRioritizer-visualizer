'use strict';

angular.module('visualizerApp')
  .controller('ReadController', ['$scope', '$upload', function ($scope, $upload) {
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
        $scope.message = 'Select a JSON file.';
        return;
      }

      $scope.file = files[0];
      readFile();
    };

    $scope.$watch('data', function (newVal, oldVal, scope) {
      if (scope.data === null)
        return;

      alert('Done');
    });

    function readFile() {
      if (!$scope.fileApiSupport || $scope.file === null)
        return;

      $scope.message = 'Reading input file...';

      var file = $scope.file;
      var reader = new FileReader();

      reader.onload = function(e) {
        var jsonStr = e.target.result;
        $scope.message = 'Parsing JSON...';
        $scope.$apply();
        $scope.data = angular.fromJson(jsonStr);
        $scope.message = 'Done';
        $scope.$apply();
      };
      reader.readAsText(file);
    };
  }]);
