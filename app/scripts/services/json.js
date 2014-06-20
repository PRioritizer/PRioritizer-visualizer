'use strict';

angular.module('visualizerApp')
  .factory('jsonFactory', function() {
    var service = {
      fileApiSupport: window.File && window.FileReader && window.FileList && window.Blob,
      data: null,
    };

    service.readFile = function readFile(file, callback, errorCallback) {
      if (!service.fileApiSupport || file === null)
        return;

      var parseJson = function(e) {
        var jsonStr = e.target.result;
        try {
          var data = angular.fromJson(jsonStr);
          service.data = data;
        } catch(err) {
          service.data = null;
          if (errorCallback)
            errorCallback(err);
        }
        if (service.data)
          callback(service.data);
      };

      var fileReader = new FileReader();
      fileReader.onload = parseJson;
      fileReader.readAsText(file);
    };

    service.getData = function getData () {
      return service.data;
    };

    service.setData = function setData (data) {
      service.data = data;
    };

    return service;
  });
