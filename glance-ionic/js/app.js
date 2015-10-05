angular.module('starter', ['ionic', 'firebase', 'starter.controllers', 'starter.directives', 'ngResource'])

  .factory("Auth", function ($firebaseAuth) {
    var usersRef = new Firebase("https//on-demand.firebaseio.com/users");
    return $firebaseAuth(usersRef);
  })
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
.factory("resetpassword", ["$resource",
  function($resource) {
    return $resource("https://lu4sdhzvbi.execute-api.us-west-2.amazonaws.com/dev/mail/reset-password"
    );
  }
])
  

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
  
    /* .state('signin', {
          url: "/signin",
          templateUrl: "templates/login.html"
        })*/

      .state('app.map', {
        url: '/map',
        views: {
          'menuContent': {
            templateUrl: 'templates/map.html',
             controller: 'MapCtrl'
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      })

      .state('splash', {
        url: '/splash',
        templateUrl: "templates/splash.html"
      })

      .state('signin', {
        url: "/signin",
        templateUrl: "templates/signin.html"
      })
      
       .state('resetpassword', {
        url: '/resetpassword',
        templateUrl: "templates/resetpassword.html"
      })
       

    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/splash');
  });

/*

angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    console.log("on load***");
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})*/
