angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  $scope.loginData = {};
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('BlogCtrl', function ($scope, Blog) {
  $scope.blogs = {};
  Blog.async('app').then(function(results){
    console.log(results);
    $scope.blogs = results.objects;
  });
})

.controller('BlogDetailCtrl', function ($scope, $stateParams, Blog) {
  $scope.blog = {};
  Blog.async('blog/' + $stateParams.id).then(function(results){
    $scope.blog = results;
  });
});
