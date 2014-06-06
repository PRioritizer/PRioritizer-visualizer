'use strict';

angular.module('visualizerApp')
  .factory('jsonFactory', function() {

    var service = {
      fileApiSupport: window.File && window.FileReader && window.FileList && window.Blob,
      data: null,
    }
    var _this = service;

    service.readFile = function readFile(file, callback) {
      if (!_this.fileApiSupport || file === null)
        return;

      var parseJson = function(e) {
        var jsonStr = e.target.result;
        var data = angular.fromJson(jsonStr);
        _this.data = data;
        callback(data);
      }

      var fileReader = new FileReader();
      fileReader.onload = parseJson;
      fileReader.readAsText(file);
    }

    return service;
});
