'use strict';

/**
 * @ngdoc service
 * @name xCoreApp.terminals
 * @description
 * # services/terminals
 * Service in the xCoreApp.
 */
angular.module('xCoreApp')
  .service('terminalsService', function ($http,serverUrl) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var result;
    var getTerminals = function() {
      return $http.get(serverUrl+"/terminals").then(handleResponse);
      //return $http.get("../files/terminals.json").then(handleResponse)
    };
    var getCompanyTerminalReport = function(data) {
      return $http.get(serverUrl+"/reports/card_type/"+ data).then(handleResponse)
    };
    var getTerminalReport = function(terminal) {
      return $http.get(serverUrl+"/terminals/terminal_number/"+terminal).then(handleResponse)
    };

    return {
      getTerminals: getTerminals,
      getTerminalReport: getTerminalReport,
      getCompanyTerminalReport:getCompanyTerminalReport
    };

    function handleResponse(res){
      result = res.data;

      return result;
    }
  });
