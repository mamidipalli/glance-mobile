angular.module('starter', ['ionic', 'firebase', 'starter.controllers', 'starter.directives'])

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https//on-demand.firebaseio.com/users");
  return $firebaseAuth(usersRef);
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

   .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  
  .state('signin', {
       url: "/signin",
       templateUrl: "templates/login.html"
     })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
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
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/signin');
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
