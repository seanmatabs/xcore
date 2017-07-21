'use strict';

/**
 * @ngdoc function
 * @name xCoreApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xCoreApp
 */
angular.module('xCoreApp')
  .controller('MainCtrl', function ($scope, terminalsService,AuthenticationService,attendanceService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    AuthenticationService.SetCredentials();

    $scope.terminalQuery = false;
    $scope.viewTerminalReports = function(terminal) {
      console.log("Terminal Reports",terminal);
      terminalsService.getTerminalReport(terminal).then(function(response){
        $scope.terminalResults = response;
        $scope.terminalQuery = true;
        console.log($scope.terminalResults);
      },function(err){

      })
    };

    $scope.return = function(){
      $scope.terminalQuery = false;
    };

    terminalsService.getTerminals().then(function (response) {
      $scope.terminals = response;
    },function(err){

    });

    attendanceService.getAttendanceReport().then(function (response) {
      $scope.terminalAccess = response;
    },function(err){

    });
    var companydata = null;
    $scope.companyname = null;
    $scope.getCompanyTransits = function() {
      $scope.loading = true;
      terminalsService.getCompanyTerminalReport($scope.companyname).then(function (response) {
        $scope.companyterminals = response;
        console.log($scope.companyterminals);
        $scope.loading = false;
      }, function (err) {
        $scope.loading = false;
      });
    };


    $scope.ExportToPDF = function () {

      function buildTableBody(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function(row) {
          var dataRow = [];

          columns.forEach(function(column) {
            console.log(row);
            console.log(column);
            dataRow.push(row[column.toLowerCase()].toString());
          });

          body.push(dataRow);
        });

        console.log(body);
        return body;
      }

      function table(data, columns) {
        return {
          table: {
            style:'demoTable',
            headerRows: 1,
            body: buildTableBody(data, columns),
            styles: {
              demoTable: {
                color: '#fff',
                fontSize: 10
              }
            }
          }
        };
      }
      var docDefinition = {

        pageMargins: [ 40, 60, 40, 60 ],
        pageSize: 'A4',
        alignment: 'center',
        header: function() {
          return {
            columns: [
              {
                text:'Kusile x-core reporting' , margin: [0, 30, 50, 0], alignment: 'center', fontSize: 16
              },
              {
                stack: [
                  { text: 'Terminal Report', alignment: 'center', color:'#013068', fontSize: 16, margin: [0, 30, 50, 0] }
                ]
              }
            ]
          }
        },
        content: [
          table($scope.terminals , ['vterminal_key',	'description',	'count'])
        ],
        footer: function (currentPage, pageCount) {
          return {
            stack: [{ canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595, y2: 5, lineWidth: 1, lineColor: '#013068', style: ['lineSpacing'] }] },
              { text: '', margin: [0, 0, 0, 5] },
              {
                columns: [
                  {},
                  { text: currentPage.toString(), alignment: 'center' },
                  { text: moment(new Date()).format("dddd DD MMMM YYYY"), alignment: 'right', margin: [0, 0, 20, 0] }
                ]
              }]

          };
        },
        styles: {
          header: {
            bold: true,
            color: '#fff',
            fontSize: 16,
            background: '#013068',
            margin:[10, 10, 10, 10],
            height:40,
            width:200
          }
        }
      };
      $scope.openPdf = function() {
        var date = new Date();
        date = moment(date).format('DD_MMM_YYYY_HH_mm_ss');
        pdfMake.createPdf(docDefinition).download('terminals_'+date+'.pdf');

        pdfMake.createPdf(docDefinition).open();
      };
      $scope.openPdf();
    }

  });
