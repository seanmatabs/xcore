'use strict';

/**
 * @ngdoc service
 * @name xCoreApp.attendance
 * @description
 * # services/attendance
 * Service in the xCoreApp.
 */
angular.module('xCoreApp')
  .service('attendanceService', function ($http,serverUrl) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var result;
    var getTerminals = function() {
      return $http.get("../files/terminals.json").then(handleResponse)
    };

    var getAttendanceReport = function() {
      return $http.get(serverUrl+"/access").then(handleResponse)

    };
    var getUserAttendanceReport = function(user) {
      console.log(user);
      return $http.post(serverUrl+"/access/",user).then(handleResponse)

    };
    var getTerminalAttendanceReport = function() {
      return $http.get("../files/fullname.json").then(handleResponse)
    };
    return {
      getAttendanceReport: getAttendanceReport,
      getTerminalAttendanceReport: getTerminalAttendanceReport,
      getUserAttendanceReport: getUserAttendanceReport
    };

    function handleResponse(res){
      result = res.data;

      return result;
    }
  });
