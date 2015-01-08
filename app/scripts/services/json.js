'use strict';

angular.module('visualizerApp')
  .factory('jsonFactory', ['$http', '$q', 'pullRequestFactory', function ($http, $q, pullRequestFactory) {
    var service = {};

    function httpGetNoCache(url) {
      // Circumvent cache by adding the current time to the query string
      return $http({
        method: 'GET',
        url: url,
        params: { 'nocache': new Date().getTime() }
      });
    }

    function transformData(data) {
      if (angular.isArray(data.pullRequests))
        data.pullRequests = data.pullRequests.map(function (pr) { return pullRequestFactory.get(pr); });
      return data;
    }

    service.getData = function getData(owner, repository, hash) {
      var deferred = $q.defer();

      httpGetNoCache('json/' + owner + '/' + hash + '.json').success(function(data) {
        data = transformData(data);
        deferred.resolve(data);
      }).error(function(data, status) {
        deferred.reject(status);
      });

       return deferred.promise;
     };

    service.fileApiSupport = window.File && window.FileReader && window.FileList && window.Blob;
    service.message = null;
    return service;
  }]);
