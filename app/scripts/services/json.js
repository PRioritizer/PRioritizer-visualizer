'use strict';

angular.module('visualizerApp')
  .factory('jsonFactory', function() {

    var service = {
      fileApiSupport: window.File && window.FileReader && window.FileList && window.Blob,
      data: null,
    };
    var _this = service;

    service.readFile = function readFile(file, callback, errorCallback) {
      if (!_this.fileApiSupport || file === null)
        return;

      var parseJson = function(e) {
        var jsonStr = e.target.result;
        try {
          var data = angular.fromJson(jsonStr);
          _this.data = data;
        } catch(err) {
          _this.data = null;
          if (errorCallback)
            errorCallback(err);
        }
        if (_this.data)
          callback(_this.data);
      };

      var fileReader = new FileReader();
      fileReader.onload = parseJson;
      fileReader.readAsText(file);
    };

    service.getData = function getData () {
      return _this.data;
    };

    service.setData = function setData (data) {
      _this.data = data;
    };

    return service;
  });
