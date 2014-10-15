'use strict';

angular.module('visualizerApp')
  .factory('pullRequestFactory', function() {
    var avatarSize = 16; // pixels

    var PullRequest = function PullRequest(obj) {
      obj = obj || {};

      for (var setting in obj) {
        if (obj.hasOwnProperty(setting))
          this[setting] = obj[setting];
      }

      // Default values
      this.avatar = (this.avatar || 'https://assets-cdn.github.com/images/gravatars/gravatar-user-420.png?') + 's=' + avatarSize;
      this.linesAdded = this.linesAdded || 0;
      this.linesDeleted = this.linesDeleted || 0;
      this.filesChanged = this.filesChanged || 0;
      this.commits = this.commits || 0;
      this.coreMember = this.coreMember || false;
      this.comments = this.comments || 0;
      this.reviewComments = this.reviewComments || 0;
      this.isMergeable = this.isMergeable || false;
      this.conflictsWith = this.conflictsWith || [];
      this.contributedCommits = this.contributedCommits || 0;
      this.acceptedPullRequests = this.acceptedPullRequests || 0;
      this.totalPullRequests = this.totalPullRequests || 0;
      this.important = this.important || 0;

      // Calculated values
      this.ratioPullRequests = this.acceptedPullRequests / this.totalPullRequests || 0;
      this.numConflicts = this.conflictsWith.length;
      this.timestamp = Date.parse(this.createdAt);
      this.lines = this.linesAdded + this.linesDeleted;
      this.ratioAdded = this.linesAdded / (this.linesAdded + this.linesDeleted) || 0;
      this.contributor = this.contributedCommits;
      this.files = this.filesChanged;
      this.allComments = this.comments + this.reviewComments;
    };

    return {
      get: function (properties) {
        return new PullRequest(properties);
      }
    };
  });
