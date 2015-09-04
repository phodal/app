angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $http, $timeout, $cordovaToast, $localstorage) {
    $scope.loginData = {};
    $scope.noLogin = true;

    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    $scope.login = function () {
      $scope.modal.show();
    };

    $scope.logout = function (){
      $scope.noLogin = true;
      $localstorage.set('token', "");
    };

    $scope.doLogin = function () {
      $timeout(function () {
        var username = $scope.loginData.username;
        var password = $scope.loginData.password;

        $http({
          method: 'POST',
          url: 'https://www.phodal.com/api-token-auth/',
          data: {
            username: username,
            password: password
          },
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent' : 'phodal/2.0 (iOS 8.1, Android 4.4)'
          }
        }).success(function (response) {
          console.log('token' + response.token);
          $scope.noLogin = false;
          $localstorage.set('token', response.token);
          $localstorage.set('username', username);

          $cordovaToast
            .show('Login Success', 'long', 'center')
            .then(function(success) {
              $scope.closeLogin();
            }, function (error) {
              // error
            });
        }).error(function (data, status) {
          console.log('data, status', data, status)
        })
      }, 1000);
    };
  })

  .controller('BlogCtrl', function ($scope, Blog) {
    $scope.blogs = {};
    //
    $scope.doRefresh = function() {
      Blog.async('app').then(function (results) {
        console.log(results);
        $scope.blogs = results.objects;
      });
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply()
    };

    Blog.async('https://www.phodal.com/api/v1/app/?format=json').then(function (results) {
      $scope.blogs = results.objects;
    });
  })

  .controller('BlogDetailCtrl', function ($scope, $stateParams, $sanitize, $sce, Blog) {
    $scope.blog = {};
    Blog.async('https://www.phodal.com/api/app/blog_detail/?search_slug=' + $stateParams.slug).then(function (results) {
      $scope.blog = results[0];
      $scope.content = $scope.blog.content;
    });
  })

  .controller('SearchCtrl', function ($scope, $stateParams, $sanitize, $sce, Blog) {
    $scope.query = "";
    var doSearch = ionic.debounce(function(query) {
      Blog.async('https://www.phodal.com/api/app/blog_detail/?search=' + query).then(function (results) {
        $scope.blogs = results;
      });
    }, 500);

    $scope.search = function(query) {
      doSearch(query);
    };
  })

  .controller('CreateBlogCtrl', function ($scope) {

  })
