angular.module('glance', ['ionic', 'glance.controllers'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
      })
      .state('app.map', {
        url: "/map",
        views: {
          'menuContent': {
            templateUrl: "templates/map.html",
            controller: 'MapCtrl'
          }
        }
      })
      .state('app.profile', {
        url: "/profile",
        views: {
          'menuContent': {
            templateUrl: "templates/profile.html",
            controller: 'AppCtrl'
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
      .state('register', {
        url: "/register",
        templateUrl: "templates/register.html"
      })

    $urlRouterProvider.otherwise('/splash');
  });
