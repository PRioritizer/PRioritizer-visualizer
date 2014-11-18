'use strict';

angular.module('visualizerApp')
  .directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
 });
