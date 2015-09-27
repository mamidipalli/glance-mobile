angular.module('glance.controllers', ['ngResource'])
.factory("glancecreateaccount", ["$resource",
  function($resource) {
    return $resource("https://lu4sdhzvbi.execute-api.us-west-2.amazonaws.com/dev/account/create");
  }
])
.factory("glancesignin", ["$resource",
  function($resource) {
    return $resource("https://lu4sdhzvbi.execute-api.us-west-2.amazonaws.com/dev/account/signin");
  }
])
.factory("glancepub", ["$resource",
  function($resource) {
    return $resource("https://lu4sdhzvbi.execute-api.us-west-2.amazonaws.com/dev/location/pub", {}, {
        'save': {method:'POST', isArray: true}
    });
  }
])
.factory("glancesms", ["$resource",
  function($resource) {
    return $resource("https://lu4sdhzvbi.execute-api.us-west-2.amazonaws.com/dev/sms/send"
    );
  }
])
.factory("glancemail", ["$resource",
  function($resource) {
    return $resource("https://lu4sdhzvbi.execute-api.us-west-2.amazonaws.com/dev/mail/confirm"
    );
  }
])
.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $state, glancemail, $http, glancecreateaccount, glancesignin) { 
    $scope.loginData = {};
    $scope.registerData = {};

    $scope.doLogin = function () {
      console.log('Authenticating '+ $scope.loginData.email);
      $http.defaults.headers.common['x-api-key'] = 'SNriDHrilP2i8MqyAypVtA8ZsyzVdy39z7USppI7';
      glancesignin.save({"email":$scope.loginData.email,"password":$scope.loginData.password}, function (authData, error) {
        if (authData.token) {
          console.log("Authenticated successfully : "+JSON.stringify(authData));
          $state.go("app.map");
        } else {
          console.log("Login Failed : " + error);
          $state.go("splash");
        }
      });
    };

    $scope.doRegister = function () {
      console.log('Registering...'+JSON.stringify($scope.registerData));
      $http.defaults.headers.common['x-api-key'] = 'SNriDHrilP2i8MqyAypVtA8ZsyzVdy39z7USppI7';
      glancecreateaccount.save({"email":$scope.registerData.email,"name":$scope.registerData.name,"phone":$scope.registerData.phone,"password":$scope.registerData.password}, function(res){
            console.log("Account Created ####:#### "+JSON.stringify(res));
            if(res != null && res.uid != null){
              console.log("userData New "+JSON.stringify(res));
              
              $http.defaults.headers.common['x-api-key'] = 'SNriDHrilP2i8MqyAypVtA8ZsyzVdy39z7USppI7';
              var res = glancemail.save({"mailid":$scope.registerData.email,"uid":res.uid});
              console.log("Sent Email : "+JSON.stringify(res));
              
              $state.go("signin");
            } else {
              $scope.error = error;
              console.log("Registration failed - "+(res != null && res.error != null) ? res.error : "");
            }
      });
    };

    $scope.logout = function () {
      $state.go("splash");
    };
})
.controller('MapCtrl', function ($scope, $ionicLoading, $compile, $http, glancepub, glancesms, $cordovaGeolocation, $cordovaContacts) {
    if (navigator.geolocation) {
      initializeMap();
      
      $cordovaGeolocation
      .getCurrentPosition({enableHighAccuracy: true})
      .then(function (position) {
        displayAndWatch(position, $http, glancepub, glancesms, $cordovaGeolocation, $cordovaContacts);
      }, locError);
      
    } else {
      alert("Your browser does not support the Geolocation API");
    }
});