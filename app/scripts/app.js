'use strict';

/**
 * @ngdoc overview
 * @name xCoreApp
 * @description
 * # xCoreApp
 *
 * Main module of the application.
 */
angular
  .module('xCoreApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angular.filter',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/access', {
        templateUrl: 'views/accessResults.html',
        controller: 'AccessCtrl'
      })
      .when('/logon', {
        templateUrl: 'views/logon.html',
        controller: 'UsersCtrl'
      })
      .when('/attendance', {
        templateUrl: 'views/attendancereports.html',
        controller: 'AttendanceCtrl'
      })
      .when('/configurable', {
        templateUrl: 'views/configurablereports.html',
        controller: 'AboutCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $locationProvider.html5Mode(true);
  })

  .constant('serverUrl','http://localhost:3000');

