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
      $scope.message = 'Reading JSON file...';
      jsonFactory.readFile(file, function success(data) {
        if (angular.isArray(data.pullRequests))
          data.pullRequests = data.pullRequests.map(function (pr) { return new PullRequest(pr); });
        $location.path('/display/');
        $scope.$apply();
      }, function error(err) {
        $scope.message = 'Could not read JSON file: ' + err.message;
        $scope.$apply();
      });
    };
  }]);

var PullRequest = function(atts) {
  var self = this;

  //initial settings if passed in
  var initialSettings = atts || {};
  for(var setting in initialSettings){
    if(initialSettings.hasOwnProperty(setting))
      self[setting] = initialSettings[setting];
  }

  self.ratioPullRequests = self.acceptedPullRequests/self.totalPullRequests || 0;
  self.numConflicts = self.conflictsWith.length;
  self.timestamp = Date.parse(self.createdAt);
  self.lines = self.linesAdded + self.linesDeleted;
  self.ratioAdded = self.linesAdded / (self.linesAdded + self.linesDeleted) || 0;
  self.contributor = self.contributedCommits;
  self.files = self.filesChanged;

  //return the scope-safe instance
  return self;
};
