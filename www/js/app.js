angular.module('starter', ['ionic', 'ngCordova',  'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
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
  .state('app.blog', {
    url: '/blog',
    views: {
      'menuContent': {
        templateUrl: 'templates/blog-list.html',
        controller: 'BlogCtrl'
      }
    }
  })
  .state('app.blog-detail', {
    url: '/blog/:id/:slug',
    views: {
      'menuContent': {
        templateUrl: 'templates/blog-detail.html',
        controller: 'BlogDetailCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/app/blog');
});
