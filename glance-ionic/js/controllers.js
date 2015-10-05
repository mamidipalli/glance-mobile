
angular.module('starter.controllers', ['ionic','firebase'])

.controller('AppCtrl', function($scope, $state, $firebase, $ionicModal, $timeout, Auth, glancemail, $http, glancecreateaccount, glancesignin, resetpassword) {
  
  $scope.loginData = {};
    $scope.registerData = {};
    
    $scope.doLoginEmail = function () {
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
  
  
  $scope.doSocialLogin = function(authMethod) {
    console.log("In signin");
    Auth.$authWithOAuthPopup(authMethod).then(function(authData) {
      // User successfully logged in
        console.log("$authWithOAuthPopup***");
      $state.go("app.map");
    }).catch(function(error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        Auth.$authWithOAuthRedirect(authMethod).then(function(authData) {
          // User successfully logged in. We can log to the console
          // since we’re using a popup here
           console.log("$authWithOAuthRedirect***");
          console.log(authData);
          $state.go("app.map");
        });
      } else {
        // Another error occurred
        console.log(error);
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
              //$scope.error = error;
              console.log("Registration failed - "+(res != null && res.error != null) ? res.error : "");
            }
      });
    };

    $scope.logout = function () {
      $state.go("splash");
    };
    
     $scope.resetPassword = function () {
     console.log('Resetting password - '+ $scope.loginData.email);
      $http.defaults.headers.common['x-api-key'] = 'SNriDHrilP2i8MqyAypVtA8ZsyzVdy39z7USppI7';
      resetpassword.save({"email":$scope.loginData.email}, function(error) {
      if (error === null) {
        console.log("Password reset email sent successfully");
        $state.go("signin");
      } else {
        console.log("Error sending password reset email:", error);
      }
      });
    };

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('MapCtrl', function($scope, $ionicLoading) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});


/*angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  $scope.centerOnMe = function () {
    console.log("--- Centering ---");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });
     console.log('Getting current location...');
     
    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});*/
