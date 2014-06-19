'use strict';

angular
  .module('visualizerApp', [
    'ngRoute',
    'angularFileUpload',
    'angularMoment',
    'angularPeity'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/read/'
      })
      .when('/read/', {
        templateUrl: 'views/read.html',
        controller: 'ReadController',
        activetab: 'read'
      })
      .when('/display/', {
        templateUrl: 'views/display.html',
        controller: 'DisplayController',
        activetab: 'display'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

jQuery.fn.peity.defaults.pie = {
  diameter: 16,
  fill: ['#ff9900', '#ffd592', '#fff4dd']
};
