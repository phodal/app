hljs.initHighlightingOnLoad();

angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'monospaced.elastic', 'ngMessages'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
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

  .run(['$state', '$window',
    function ($state, $window) {
      $window.addEventListener('AppIndexing', function (e) {
        var urlSlug = e.detail.url.split("/");
        if (urlSlug[3] && urlSlug[4] && urlSlug[3] === 'blog') {
          $state.go('app.blog-detail', {slug: urlSlug[4]});
        }
      });
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

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl'
          }
        }
      })

      .state('app.blog-create', {
        url: '/blog/create',
        views: {
          'menuContent': {
            templateUrl: 'templates/create.html',
            controller: 'CreateBlogCtrl'
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
        url: '/blog/:slug',
        views: {
          'menuContent': {
            templateUrl: 'templates/blog-detail.html',
            controller: 'BlogDetailCtrl'
          }
        }
      });
    $urlRouterProvider.otherwise('/app/blog');
  });

function handleOpenURL(url) {
  var event = new CustomEvent('AppIndexing', {detail: {'url': url}});
  setTimeout(function () {
    window.dispatchEvent(event);
  }, 0);
}
