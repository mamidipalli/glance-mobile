angular.module('starter.controllers', ['firebase','ngResource'])
.factory("Auth", ["$firebaseAuth",
    function ($firebaseAuth) {
      var ref = new Firebase("https://on-demand.firebaseio.com");
      return $firebaseAuth(ref);
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
.controller('AppCtrl', function ($scope, $ionicModal, $timeout, Auth, $state, glancemail, $http) {
    $scope.loginData = {};
    $scope.registerData = {};

    $scope.doLogin = function () {
      forge.logging.log('Authenticating '+ $scope.loginData.email);

      var ref = new Firebase("https://on-demand.firebaseio.com");
      ref.authWithPassword({
        email: $scope.loginData.email,
        password: $scope.loginData.password
      }, function (error, authData) {
        if (error) {
          forge.logging.log("Login Failed! " + error);
          $state.go("splash");
        } else {
          forge.logging.log("Authenticated successfully!");
          $state.go("app.map");
        }
      });
    };
    
    $scope.doRegister = function () {
      forge.logging.log('Registering...'+JSON.stringify($scope.registerData));
      Auth.$createUser({
        email: $scope.registerData.email,
        password: $scope.registerData.password
      }).then(function (userData) {
        $scope.message = "User created with uid: " + userData.uid;
        var usersRef = new Firebase('https://on-demand.firebaseio.com/users');
        usersRef.child(userData.uid).set({ email: $scope.registerData.email, name: $scope.registerData.name, phone: $scope.registerData.phone });
        sendverificationemail($http, glancemail, $scope.registerData.email)
        $state.go("signin");
      }).catch(function(error) {
        $scope.error = error;
        forge.logging.log("Registration failed - "+error);
      });
    };

    $scope.logout = function () {
      $state.go("splash");
    };
})
.controller('MapCtrl', function ($scope, $ionicLoading, $compile, $http, glancepub, glancesms) {
    forge.launchimage;
    if (navigator.geolocation) {
      initializeMap();
      navigator.geolocation.getCurrentPosition(
        function dAW(position) {
          displayAndWatch(position, $http, glancepub, glancesms);
        }
        ,
        locError, { enableHighAccuracy: true });
    } else {
      alert("Your browser does not support the Geolocation API");
    }
});