'use strict';

/**
 * @ngdoc function
 * @name xCoreApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the xCoreApp
 */
angular.module('xCoreApp')
  .controller('UsersCtrl', function ($scope,$rootScope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $rootScope.loginpage = true;
    $scope.loginUser = {};
    $scope.login = function(data){
      console.log('Loging in ',data);
    }
  });
