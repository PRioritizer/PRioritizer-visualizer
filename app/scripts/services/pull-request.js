'use strict';

angular.module('visualizerApp')
  .factory('pullRequestFactory', function() {
    var PullRequest = function PullRequest(obj) {
      obj = obj || {};

      for (var setting in obj) {
        if (obj.hasOwnProperty(setting))
          this[setting] = obj[setting];
      }

      this.ratioPullRequests = this.acceptedPullRequests / this.totalPullRequests || 0;
      this.numConflicts = this.conflictsWith.length;
      this.timestamp = Date.parse(this.createdAt);
      this.lines = this.linesAdded + this.linesDeleted;
      this.ratioAdded = this.linesAdded / (this.linesAdded + this.linesDeleted) || 0;
      this.contributor = this.contributedCommits;
      this.files = this.filesChanged;
    };

    return {
      get: function (properties) {
        return new PullRequest(properties);
      }
    };
  });
