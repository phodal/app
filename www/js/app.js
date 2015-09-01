angular.module('starter', ['ionic', 'ngCordova', 'hc.marked', 'starter.controllers', 'starter.services'])

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
    var handleOpenURL = function(url) {
      $cordovaToast.showShortTop(url).then(function(success) {
        // success
      }, function (error) {
        // error
      });
    };
  });
})

.config(['markedProvider', function (markedProvider) {
  markedProvider.setOptions({
    gfm: true,
    tables: true,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  })
}])

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
    url: '/blog/:slug?:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/blog-detail.html',
        controller: 'BlogDetailCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/app/blog');
});
