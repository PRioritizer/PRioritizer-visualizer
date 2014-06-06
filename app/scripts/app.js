'use strict';

angular
  .module('visualizerApp', [
    'ngRoute',
    'angularFileUpload'
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
