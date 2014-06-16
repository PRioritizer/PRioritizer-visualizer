'use strict';

angular.module('visualizerApp')
  .directive('angularPr', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: false,
      templateUrl: 'views/pull-request.html'
    };
  });
