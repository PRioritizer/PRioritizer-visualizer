/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Brian Hines
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @author: Brian Hines (projectweekend)
 * @url:    https://github.com/projectweekend/angular-peity/
*/

'use strict';

var angularPeity = angular.module('angularPeity', []);

var buildChartDirective = function (chartType) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      options: '='
    },
    link: function (scope, element, attrs) {
      var options = scope.options || {};
      var span = document.createElement('span');
      span.textContent = angular.isArray(scope.data) ? scope.data.join() : scope.data + '';

      for (var key in attrs.$attr)
        if (key !== 'data')
          span.setAttribute(key, attrs[key]);

      if (element[0].nodeType === 8)
        element.replaceWith(span);
      else
        element[0].appendChild(span);

      jQuery(span).peity(chartType, options);
    }
  };
};

angularPeity.directive('pieChart', function () {
  return buildChartDirective('pie');
});

angularPeity.directive('barChart', function () {
  return buildChartDirective('bar');
});

angularPeity.directive('lineChart', function () {
  return buildChartDirective('line');
});
