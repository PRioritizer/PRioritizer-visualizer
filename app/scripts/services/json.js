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

    function initialize() {
      return httpGetNoCache('json/index.json')
        .success(function(data) {
          service.repositories = data;
        });
    }

    function getRepositoryFile(owner, repo) {
      var repos = service.repositories.filter(function(r) { return r.owner.toLowerCase() === owner && r.repo.toLowerCase() === repo; });
      return repos.length > 0 ? repos[0].file.toLowerCase() : null;
    }

    service.getData = function getData(owner, repository) {
      var deferred = $q.defer();
      owner = (owner || '').toLowerCase();
      repository = (repository || '').toLowerCase();

      service.init
        .then(function() {
          var file = getRepositoryFile(owner, repository);
          httpGetNoCache('json/' + file).success(function(data) {
            data = transformData(data);
            deferred.resolve(data);
          }).error(function(data, status) {
            deferred.reject(status);
          });
        });

       return deferred.promise;
     };

    service.getRepositories = function getRepositories() {
      return service.repositories;
    };

    service.fileApiSupport = window.File && window.FileReader && window.FileList && window.Blob;
    service.message = null;
    service.repositories = [];
    service.init = initialize();
    return service;
  }]);
