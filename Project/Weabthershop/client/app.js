var fbOAuth = angular.module('fbOAuth', []);

fbOAuth.controller('StartCtrl', [ '$scope', '$http', function ($scope, $http) {

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
    $http({
      method: 'GET',
      url: 'https://graph.facebook.com/v2.5/me?fields=name,location&access_token=' + params.access_token
    }).then(function (response) {
      $scope.name = response.data.name,
      $scope.location = response.data.location;
    }, function (err) {
      $scope.name = err,
      $scope.location = err;
    });
  }

  $scope.name = "Weather will be inflated here";
  if (params.access_token) {
    $http({
      method: 'GET',
      url: 'http://api.openweathermap.org/data/2.5/weather?q=' + location.name
    }).then(function (response) {
      $scope.name = response.data.name,
      $scope.location = response.data.location;
    }, function (err) {
      $scope.name = err,
      $scope.location = err;
    });
  }

//HIER DE APP ID IN PLAATSEN EN URL VAN WEBSITE OF LOCALHOST MET JUISTE POORT
  $scope.login = function() {
    window.location.href = "https://www.facebook.com/dialog/oauth?client_id=425312821159600&response_type=token&redirect_uri=http://localhost:3000/"
  };

}]);