'use strict';

/**
 * @ngdoc function
 * @name xCoreApp.controller:AttendanceCtrl
 * @description
 * # AttendanceCtrl
 * Controller of the xCoreApp
 */
angular.module('xCoreApp')
  .controller('AttendanceCtrl', function ($scope,attendanceService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var data ={};

      $scope.start = new Date();

      $scope.end = new Date();

    $scope.username = null;
    $scope.loading = false;
    $scope.viewUserReports = function(){
      data.username =$scope.username;
      console.log($scope.start);
      console.log($scope.end);
      if($scope.start !== undefined && moment($scope.start).format("YYYY-MM-DD").toLowerCase()!== "invalid date"){
        data.date = moment($scope.start).format("YYYY-MM-DD");
      }else{

      }
      if( $scope.end !== undefined && moment($scope.end).format("YYYY-MM-DD").toLowerCase()!== "invalid date"){
        data.end =  moment($scope.end).format("YYYY-MM-DD");
      }else{

      }
      console.log(data);
      $scope.loading = true;
      $scope.userAttendance = null;
      $scope.userCompany = null;
      $scope.phoneNumber = null;
      $scope.vehicleRegistration = null;
      $scope.cardNumber = null;
      attendanceService.getUserAttendanceReport(data).then(function(response){
        console.log(response);
        if(response.length > 0) {
          $scope.userAttendance = response;
          if($scope.userAttendance[1].company) {
            console.log($scope.userAttendance[1].company);
            $scope.userCompany = $scope.userAttendance[1].company;
          }
          var i = 1;
          while($scope.phoneNumber === undefined) {
            $scope.phoneNumber = $scope.userAttendance[i].phoneNumber;
            i += 1;
          }
          while($scope.vehicleRegistration === undefined) {
            $scope.vehicleRegistration = $scope.userAttendance[i].vehicleRegistration;
            i += 1;
          }
          while($scope.cardNumber === undefined) {
            $scope.cardNumber = $scope.userAttendance[i].cardNumber;
            i += 1;
          }
        }
        $scope.loading = false;
      },function(error){
        $scope.loading = false;
        alert(JSON.stringify(error));
      })
    };
    $scope.date = new Date();
    console.log(moment($scope.date).format("dddd DD MMMM YYYY"));
    $scope.back = function(){
      $scope.username = '';
      $scope.notViewingResults = false;
      $scope.userAttendance = [];
    };

    $scope.formatDate = function(date){
      console.log(moment($scope.date).format("dddd DD MMMM YYYY"));
      return moment($scope.date).format("dddd DD MMMM YYYY");
    };
    $scope.removeVc = function(){
      for(var id in $scope.attendancelist){
        $scope.attendancelist[id].cardType = $scope.attendancelist[id].cardType.replace("(VC)","").trim();
      }
    };

    $scope.ExportToPDF = function (name) {

      function buildTableBody(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function(row) {
          var dataRow = [];

          columns.forEach(function(column) {
            console.log(row);
            if(column === 'transitDate'){
              dataRow.push(moment(row[column].toString()).format("MMM DD YYYY"))
            }else if(column === 'time'){
              dataRow.push(moment(row[column].toString()).format("hh:mm:ss"))
            }else {
              dataRow.push(row[column].toString());
            }
          });

          body.push(dataRow);
        });
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
      var headerstring = 'Attendance Report for '+$scope.username +' ('+ $scope.userCompany+')';
      console.log(headerstring);
      var docDefinition = {
        content: [
          {text: headerstring, alignment: 'center', color:'#013068', fontSize: 16, margin: [0, 30, 50, 0] },
          table($scope.userAttendance , ['terminal','transitDate','time', 'strDirection'])
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
            padding:100,
            background: '#013068',
            margin:20,
            height:40,
            width:1000
          }
        }
      };
      $scope.openPdf = function() {
        console.log("Printing");
        pdfMake.createPdf(docDefinition).open();
        pdfMake.createPdf(docDefinition).download('terminals_'+moment($scope.date).format("dddd DD MMMM YYYY")+'.pdf');
      };
      $scope.openPdf();
    }
  });
