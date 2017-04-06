'use strict';

// fltplans controller
angular.module('fltplans').controller('fltplansController', ['$scope', '$element', '$filter','$http', '$stateParams', '$location', 'Authentication', 'Fltplans',
  function ($scope, $element, $filter, $http, $stateParams, $location, Authentication, Fltplans) {

    $scope.authentication = Authentication;

    $scope.open = false;
    $scope.showMETAR = false;

    $scope.collapse = function (airport) {
      airport.collapsed = !airport.collapsed;
      for (var qw = 0; qw < $scope.airports.length; qw++){
        if (airport !== $scope.airports[qw]){
          $scope.airports[qw].collapsed = true;
        }
      }
    };

    $scope.collapseMETAR = function () {
      $scope.showMETAR = !$scope.showMETAR;
    };

    $scope.toggleDropdown = function () {
      $scope.open = !$scope.open;
    };

    $scope.leaveDropdown = function () {
      $scope.open = false;
    };

    var setRoute = function (r) {
      $scope.route = r;
      console.log("set");
    };

    var objExists = function (obj) {
      for(var key in obj) {
        if(obj.hasOwnProperty(key))
          return true;
      }
      return false;
    };

    $scope.airports = {};

    $scope.validateRoute = function (route) {
      var input = route.split(" ");
      var isValid = false;


      $scope.airports = [];

      //format input
      if (input.length > 7){
        isValid = false;
      }
      else{
        for (var x = 0; x < input.length; x++){
          if (input[x].length < 3)
          {
            //Invalid entry, exit loop, alert user
            isValid = false;
            break;
          }
          else if (input[x].length === 3) {
            //"K" must preceed all U.S. Airports
            input[x] = "K" + input[x];
            isValid = true;
          }
          else if (input[x].length === 4) {
            isValid = true;
          }
          else{
            isValid = false;
            break;
          }

          //assign airport to airports
          $scope.airports.push({
            ident: input[x],
            collapsed: true,
            sortable: true,
            resizable: true
          });
        }
      }
      //console.log($scope.airports);

      //Form request route
      var requestRoute = input[0] + ",";
      for (var y = 1; y < input.length; y++){
        requestRoute += input[y] + ",";
      }

      //check valid
      if (isValid){
        $scope.submit(requestRoute);
      }
      else{
        alert("Invalid Input");
      }
    };

    //Load Weather and Airport Data
    $scope.submit = function (route) {

      $scope.showBody = true;

      //encodeURIComponent will not encode ~!*()'
      //escape will not encode @*/+
      var yahoo = 'https://query.yahooapis.com/v1/public/yql?q=';
      var select = "select%20*%20from%20html%20where%20url%3D'";
      var queryURL = encodeURIComponent("https://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=");
      var extra = "%26hoursBeforeNow%3D3";
      var format = "'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

      var RequestURL = yahoo + select + queryURL + encodeURIComponent(route) + extra + format;

      //GET METARs from YQL
      $http.get(RequestURL)
    .then(function(response){
      //console.log(response);
      //console.log(response.data.query.results.body.response.data_source.request.errors.warnings.data.metar);
      $scope.metars = response.data.query.results.body.response.data_source.request.errors.warnings.data.metar;

      //check conditions
      $scope.flightConditions = function (metar) {
        if(metar.sky_condition.flight_category !== undefined){
          return metar.sky_condition.flight_category;
        }
        else if (metar.sky_condition.sky_condition.flight_category !== undefined) {
          return metar.sky_condition.sky_condition.flight_category;
        }
        else {
          return 'Flight conditions error';
        }
      };

      $scope.time = function (time) {
        var date = new Date(time);
        return date.toString();
      };

      $scope.convertToF = function (c) {
        return ((c*(9/5))+32).toFixed(1);
      };

      $scope.altim = function (altim) {
        return Number(altim).toFixed(2);
      };

      $scope.humidity = function (metar) {
        var t = Number(metar.temp_c),
          d = Number(metar.dewpoint_c);
        var top = Math.exp((17.625*d)/(243.04+d));
        var btm = Math.exp((17.625*t)/(243.04+t));
        return (100*(top/btm)).toFixed(0);
      };

      /*
      $scope.density_altitude = function (metar) {
      };
      */

    });

      //Airports

      //setup queryURL
      var a ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'https%3A%2F%2Fnfdc.faa.gov%2FnfdcApps%2Fservices%2FairportLookup%2FairportDisplay.jsp%3FairportId%3D";
      var b = "'%20and%20xpath%3D'%2F%2Ftbody%2F*%5Bcontains(.%2C%22";
      var c = "%22)%5D'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
      var chartURL = [5];
      chartURL[0] = 'http://vfrmap.com/api?req=map&type=vfrc&lat=';
      chartURL[1] = '&lon=';
      chartURL[2] = '&zoom=10&width=500&height=350';
      chartURL[3] = 'http://vfrmap.com/?type=vfrc&lat=';
      chartURL[4] = '&zoom=10';
      var thisURL;

      var convertCoord = function (latLongInDMS) {
        //assumes NW hemisphere always
        var latLongSplit = latLongInDMS.split("/");
        //lat
        var latDMS = latLongSplit[0].split("-");
        var SDirect = latDMS[2].split(" ");
        latDMS[2] = SDirect[0];
        //long
        var longDMS = latLongSplit[1].split("-");
        var SDirect2 = longDMS[2].split(" ");
        longDMS[2] = SDirect2[0];
        //convert
        var latLongInDeg = [2];
        latLongInDeg[0] = parseInt(latDMS[0]) + parseInt(latDMS[1])/60 + parseInt(latDMS[2])/(60*60);
        latLongInDeg[1] = -1*(parseInt(longDMS[0]) + parseInt(longDMS[1])/60 + parseInt(longDMS[2])/(60*60));
        return latLongInDeg;
      };

      //GET data
      var getData = function(idx, target, attribute) {
        thisURL = a + $scope.airports[idx].ident + b + target + c;
        $http.get(thisURL)
        .then(function(response){
          if (response.data.query.results){
            if (response.data.query.results.tr.length > 1){
              $scope.airports[idx][attribute] = response.data.query.results.tr[0].td[1];
            }
            else if (response.data.query.results.tr){
              $scope.airports[idx][attribute] = response.data.query.results.tr.td[1];
            }
            else{
              console.log("Could not retrieve data: " + attribute + " for " + $scope.airports[idx].ident);
            }
          }
          if (attribute === 'latLong'){
            var coordInDegrees = convertCoord($scope.airports[idx].latLong);
            $scope.airports[idx].chartLink = chartURL[3] + coordInDegrees[0] + chartURL[1] + coordInDegrees[1] + chartURL[4];
            $scope.airports[idx].chartURL = chartURL[0] + coordInDegrees[0] + chartURL[1] + coordInDegrees[1] + chartURL[2];
          }
        },function(err){
          console.log("Error, could not get data for Airport:" + $scope.airports[idx].ident + "Attribute: " + attribute);
        });
      };

      var a2 = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'https%3A%2F%2Fnfdc.faa.gov%2FnfdcApps%2Fservices%2FairportLookup%2FairportDisplay.jsp%3FairportId%3D";
      var b2 ="'%20and%20xpath%3D'%2F%2Fdiv%5Bcontains(%40id%2C%22";
      var c2 = "%22)%5D'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

      //GET comm and runways
      var getData2 = function(idx, target, attribute) {
        thisURL = a2 + $scope.airports[idx].ident + b2 + target + c2;
        $http.get(thisURL)
        .then(function(response){
          $scope.airports[idx][attribute] = response.data.query.results.div;
          if (attribute === 'comms'){
            $scope.airports[idx][attribute] = response.data.query.results.div.table.tbody.tr;
          }
          console.log(response.data.query.results.div);
        },function(err){
          console.log("Error, could not get data for Airport:" + $scope.airports[idx].ident + "Attribute: " + attribute);
        });
      };

      var a3 = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'https%3A%2F%2Fnfdc.faa.gov%2FnfdcApps%2Fservices%2FairportLookup%2FairportDisplay.jsp%3FairportId%3D";
      var b3 = "'%20and%20xpath%3D'%2F%2Fspan%5B%40class%3D%22";
      var c3 = "%22%5D'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

      var getData3 = function(idx, target, attribute) {
        thisURL = a3 + $scope.airports[idx].ident + b3 + target + c3;
        $http.get(thisURL)
        .then(function(response){
          $scope.airports[idx][attribute] = response.data.query.results.span;
          console.log($scope.airports);
        },function(err){
          console.log("Error, could not get data for Airport:" + $scope.airports[idx].ident + "Attribute: " + attribute);
        });
      };

      //Loop for all Airports
      for (var index = 0; index < $scope.airports.length; index++){
        //data
        getData(index, encodeURIComponent("Latitude/Longitude"), "latLong");  //Latitude/Longitude
        getData(index, encodeURIComponent("Elevation"), "elevation");
        getData(index, encodeURIComponent("Variation"), "variation");
        getData(index, encodeURIComponent("From city"), "city");
        getData(index, encodeURIComponent("Section chart"), "sectional");
        getData(index, encodeURIComponent("Time Zone"), "timezone");
        getData(index, encodeURIComponent("Facility use"), "facilityUse");
        getData(index, encodeURIComponent("FSS"), "fss");
        //getData(index, encodeURIComponent("Attendance"), "attendance");
        getData(index, encodeURIComponent("Wind Indicator"), "windIndicator");
        getData(index, encodeURIComponent("Beacon"), "beacon");
        //getData(index, encodeURIComponent("Landing Fee"), "fee");
        //comms
        getData2(index, encodeURIComponent("communications"), "comms");
        //runways
        getData2(index, encodeURIComponent("runway"), "runways");
        //nav chart
        getData3(index, encodeURIComponent("chartLink"), "charts");
      }


      //search extra comm response
      $scope.findComm = function (com) {
        //console.log(com);
        //defined
        if (com !== undefined)
        {
          if(com.span !== undefined){
            return com.span.content;
          }
          else if(com.content !== undefined){
            return com.content;
          }
          else{
            return com;
          }
        }
        //undefined
        return "";
      };


    };

    // Create new fltplan
    $scope.create = function () {
      $scope.error = null;

      /*
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'fltplanForm');

        return false;
      }
      */

      // Create new fltplan object
      var fltplan = new Fltplans({
        route: this.route
      });

      // Redirect after save
      fltplan.$save(function (response) {
        alert("Favorite route saved!");
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing fltplan
    $scope.remove = function (fltplan) {
      if (fltplan) {
        fltplan.$remove();

        for (var i in $scope.fltplans) {
          if ($scope.fltplans[i] === fltplan) {
            $scope.fltplans.splice(i, 1);
          }
        }
      } else {
        $scope.fltplan.$remove(function () {
          $location.path('fltplans');
        });
      }
    };

    // Update existing fltplan
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'fltplanForm');

        return false;
      }

      var fltplan = $scope.fltplan;

      fltplan.$update(function () {
        $location.path('fltplans/' + fltplan._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of fltplans
    $scope.find = function () {
      $scope.fltplans = Fltplans.query();
    };

    // Find existing fltplan
    $scope.findOne = function () {
      $scope.fltplan = Fltplans.get({
        fltplanId: $stateParams.fltplanId
      });
    };

  }
]);
