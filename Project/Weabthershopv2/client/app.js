var app = angular.module('app', []);
app.controller('LocationController', [ '$scope', '$http', function ($scope, $http) {

  parseParams = function() {
    var params = {}, queryString = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
  };

  params = parseParams();
  
  $scope.name = "Name will be inflated here";

  if (params.access_token) {
    // GET FACEBOOK AUTHENTICATION AND CURRENT LOCATION
    $http({
      method: 'GET',
      url: 'https://graph.facebook.com/v2.5/me?fields=name,location&access_token=' + params.access_token
    }).then(function (response) {
      $scope.name = response.data.name,
      $scope.location = response.data.location;

      var obj = [response.data.location];
      var locationData = obj[0].name;
      var locationDataWithoutSpaces = locationData.replace(" ", "");

      console.log(locationDataWithoutSpaces);

      // GET WEATHER DATA
      $http({
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/weather?q=' + locationDataWithoutSpaces + '&appid=adcac255880eb8fa08934bac086b405b'
      }).then(function (response) {

        var tempKelvin = response.data.main.temp;
        var humidity = response.data.main.humidity;
        var wind = response.data.wind.speed;
        var clouds = response.data.clouds.all;

        var tempCentigrade = (tempKelvin - 273,15);

        $scope.tempCentigrade = tempCentigrade;
        $scope.humidity = humidity;
        $scope.wind = wind;
        $scope.clouds = clouds;

        var t = tempCentigrade;
        var h = humidity;
        var w = wind;
        var c = clouds;

        var keywordFirebase;

        var key1;
        var key2 = "fail";

        if(h <= 2){
          h = 2;
        }

        var n = (t*h);

        // tropical storm:
        if((w > 20) && (h > 30) && (t > 25)){
          key1 = "tropicalstorm";
          keywordFirebase = "tropicalstorm";
        }

        // snow:
        else if((h >= 30) && (t < 0)){
          key1 = "snow";
          keywordFirebase = "snowcold";
        }

        // wind still, just rain
        else if((h > 30) && (w < 4)){
          key1 = "rain";
          keywordFirebase = "windlessrain";
        }

        // rainy hot:
        else if((t > 30) && (h > 30)){
          key1 = "warmth";
          keywordFirebase = "rainyhot";
        }

        // rainy warm:
        else if((t > 20) && (h > 30)){
          key1 = "chocolaterain";
          keywordFirebase = "rainywarm";
        }

        // hurricane:
        else if((w > 30)){
          key1 = "hurricane";
          keywordFirebase = "hurricane";
        }    

        // stormy:
        else if(w > 17){
          key1 = "storm";
          keywordFirebase = "stormy";
        }    

        // just cold:
        else if(t < 0){
          key1 = "freezing";
          keywordFirebase = "freezingcold";
        }

        // naked:
        else if(t > 35){
          key1 = "sweat";
          keywordFirebase = "topicalhot";
        }

        // shorts:
        else if(t > 20){
          key1 = "warm";
          keywordFirebase = "justwarm";
        }

        // trousers + raincoat/umbrella:
        else if((t >0) && (h > 30)){
          key1 = "umbrella";
          keywordFirebase = "rainumbrella";
        }

        // trousers
        else if(t >= 0){
          key1 = "boring";
          keywordFirebase = "normal";
        }



        // GET EBAY DATA
/*
      $http({
        method: 'POST',
        url: 'http://svcs.sandbox.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=KoenScha-Weabther-SBX-3090fc79c-10e655bb&RESPONSE-DATA-FORMAT=XML&REST-PAYLOAD&keywords=harry%20potter%20phoenix'
      }).then(function (response) {

        alert();


        }, function (err) {
      });

      EBAY STAAT GEEN GET TOE VIA LOCALHOST
*/

      // GET AMAZON DATA
      // HEEFT CREDIT CARD NODIG - KRIJG VERIFICATIE VIA TELEFOON NIET IN ORDE


      // GET ALIBABA/ALIEXPRESS DATA
      // DUURT 5 WERKDAGEN VOOR API KEY - NOG STEEDS NIET ONTVANGEN


      // GET YOUTUBE VIDEOS
      // API:  AIzaSyBDS45ux2MixCASP3vUYRRfI14gsGawGvM

        $http({
            method: 'GET',
            url: 'https://weabthershop.firebaseio.com/shoplist.json'
        }).then(function (response) {

          var firebaseData;

          /*
        tropicalstorm
        snowcold
        windlessrain
        rainyhot
        rainywarm
        hurricane
        stormy
        freezingcold
        topicalhot
        justwarm
        rainumbrella
        normal
          */

          switch(keywordFirebase) {
            case "tropicalstorm":
              firebaseData = response.data.tropicalstorm;

            case "snowcold":
              firebaseData = response.data.snowcold;

            case "windlessrain":
              firebaseData = response.data.windlessrain;

            case "ainyhot":
              firebaseData = response.data.rainyhot;

            case "rainywarm":
              firebaseData = response.data.rainywarm;

            case "hurricane":
              firebaseData = response.data.hurricane;

            case "stormy":
              firebaseData = response.data.stormy;

            case "freezingcold":
              firebaseData = response.data.freezingcold;

            case "topicalhot":
              firebaseData = response.data.topicalhot;

            case "tropicalstorm":
              firebaseData = response.data.justwarm;

            case "rainumbrella":
              firebaseData = response.data.rainumbrella;

            case "normal":
              firebaseData = response.data.normal;
 
            }

            $scope.firebaseImage = firebaseData;
            $scope.keywordFirebase = keywordFirebase;
            $scope.keywordYoutube = key1;

        }), function (err) {
          $scope.firebaseImage = err;
        }

      $http({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/search?part=snippet' +
                     '&q=fail' + key1 + '+' + key2 +
                     '&maxResults=1' +
                     '&order=rating' +
                     '&type=video' +
                     '&videoDefinition=high' +
                     '&videoEmbeddable=true' +
                     '&key=AIzaSyBDS45ux2MixCASP3vUYRRfI14gsGawGvM'

                     // ' + key1 + '+' + key2 + '+' + key3 +
      }).then(function (response) {

        $scope.title = response.data.items[0].snippet.title;
        $scope.description = response.data.items[0].snippet.description;
        $scope.thumbnail = response.data.items[0].snippet.thumbnails.medium.url;
        $scope.watchId = response.data.items[0].id.videoId;



        //      $scope.name = response.data.name,
        //      $scope.location = response.data.location;

        //      var obj = [response.data.location];
        //      var locationData = obj[0].name;

        }, function (err) {
          $scope.dataItems = err;
      });

      }, function (err) {
        $scope.tempCentigrade = err,
        $scope.humidity = err;
        $scope.wind = err,
        $scope.clouds = err;
      });

    }, function (err) {
      $scope.name =   err,
      $scope.location = err;
    });
  }

  
//HIER DE APP ID IN PLAATSEN EN URL VAN WEBSITE OF LOCALHOST MET JUISTE POORT
  $scope.login = function() {
    window.location.href = "https://www.facebook.com/dialog/oauth?client_id=425312821159600&response_type=token&redirect_uri=http://localhost:3000/"
  };

// EBAY STAAT ENKEL HTTPS TOE, LOCALHOST WERKT ENKEL MET HTTP, BEHALVE WANNEER SELF SIGNED. NIET GEDAAN.
    //$scope.ebay = function(){
    //window.location.href = "https://signin.sandbox.ebay.com/authorize?client_id=KoenScha-Weabther-SBX-3090fc79c-10e655bb&redirect_uri=http://localhost:3000/&response_type=code"
    // &scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope%2Fsell.account%20https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope%2Fsell.inventory"
  //}

}]);






