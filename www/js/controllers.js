angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $http, $timeout, transformRequestAsFormPost) {
    $scope.loginData = {};
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

    $scope.doLogin = function () {
      console.log($scope.loginData);
      $timeout(function () {
        $http({
          method: 'POST',
          url: 'http://localhost:8000/api-token-auth/',
          data: {
            username: $scope.loginData.username,
            password: $scope.loginData.password
          }
        }).success(function (response) {
          console.log(response);
          $scope.closeLogin();
        }).error(function (data, status) {

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
    Blog.async('http://www.phodal.com/api/app/blog_detail?search_slug=' + $stateParams.slug).then(function (results) {
      $scope.blog = results[0];
      $scope.content = $scope.blog.content;
    });
  })

  .controller('SearchCtrl', function ($scope, $stateParams, $sanitize, $sce, Blog) {
    $scope.query = "";
    var doSearch = ionic.debounce(function(query) {
      Blog.async('http://www.phodal.com/api/app/blog_detail?search=' + query).then(function (results) {
        $scope.blogs = results;
      });
    }, 500);

    $scope.search = function(query) {
      doSearch(query);
    };
  });
