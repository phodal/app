angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $http, $timeout, $cordovaToast, $localstorage) {
    $scope.loginData = {};
    $scope.noLogin = true;
    if ($localstorage.get('username')) {
      $scope.loginData.username = $localstorage.get('username');
    }

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

    $scope.logout = function () {
      $scope.noLogin = true;
      $localstorage.remove('token');
    };

    $scope.doLogin = function () {
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
          'User-Agent': 'phodal/2.0 (iOS 8.1, Android 4.4)'
        }
      }).success(function (response) {
        console.log('token' + response.token);
        $scope.noLogin = false;
        $localstorage.set('token', response.token);
        $localstorage.set('username', username);

        $cordovaToast
          .show('Login Success', 'long', 'center')
          .then(function (success) {
            $scope.closeLogin();
          }, function (error) {
            // error
          });
      }).error(function (data, status) {
        console.log('data, status', data, status)
      })
    };
  })

  .controller('BlogCtrl', function ($scope, Blog) {
    $scope.blogs = null;
    $scope.blogOffset = 0;
    //
    $scope.doRefresh = function () {
      Blog.async('https://www.phodal.com/api/v1/app/?format=json').then(function (results) {
        $scope.blogs = results.objects;
      });
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply()
    };

    Blog.async('https://www.phodal.com/api/v1/app/?format=json').then(function (results) {
      $scope.blogs = results.objects;
    });

    $scope.loadMore = function () {
      $scope.blogOffset = $scope.blogOffset + 1;
      Blog.async('https://www.phodal.com/api/v1/app/?limit=10&offset=' + $scope.blogOffset * 20 + '&format=json').then(function (results) {
        Array.prototype.push.apply($scope.blogs, results.objects);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    };
  })

  .controller('BlogDetailCtrl', function ($scope, $stateParams, $sanitize, $sce, Blog, $ionicLoading, $localstorage, marked) {
    $localstorage.set('image', "");
    $ionicLoading.show({
      animation: 'fade-in',
      template: 'Loading...'
    });
    $scope.blog = {};
    Blog.async('https://www.phodal.com/api/app/blog_detail/?search_slug=' + $stateParams.slug).then(function (results) {
      $ionicLoading.hide();
      $scope.blog = results[0];
      $scope.content = $scope.blog.content;
      $scope.htmlContent = $sce.trustAsHtml(marked($scope.blog.content));

      console.log($localstorage.get('image'));
    });
  })

  .controller('SearchCtrl', function ($scope, $stateParams, $sanitize, $sce, Blog) {
    $scope.query = "";
    var doSearch = ionic.debounce(function (query) {
      Blog.async('https://www.phodal.com/api/app/blog_detail/?search=' + query).then(function (results) {
        $scope.blogs = results;
      });
    }, 500);

    $scope.search = function (query) {
      doSearch(query);
    };
  })

  .controller('CreateBlogCtrl', function ($scope, $localstorage, $cordovaToast, $http, $state) {
    $scope.posts = {};
    $scope.alreadyLoadDraft = $localstorage.get('draft') !== undefined;
    $scope.isLocalDraft = function () {
      return $scope.alreadyLoadDraft;
    };

    $scope.load = function () {
      var draft = JSON.parse($localstorage.get('draft'));
      $scope.posts = draft;
      $scope.posts.publish_date = new Date(draft.publish_date);
      $scope.alreadyLoadDraft = false;
    };

    $scope.save = function () {
      var data = serialData($scope.posts);
      $scope.alreadyLoadDraft = true;
      $localstorage.set('draft', JSON.stringify(data));
    };

    $scope.create = function () {
      var token = $localstorage.get('token');
      var data = serialData($scope.posts);

      $http({
        method: 'POST',
        url: 'https://www.phodal.com/api/app/blog/',
        data: data,
        headers: {
          'Authorization': 'JWT ' + token,
          'User-Agent': 'phodal/2.0 (iOS 8.1, Android 4.4)'
        }
      }).success(function (response) {
        if ($localstorage.get('draft')) {
          $localstorage.remove('draft');
        }

        $scope.posts = {};
        $cordovaToast
          .show('Create Success', 'long', 'center')
          .then(function (response) {
            if (data.status === 2) {
              $state.go('app.blog-detail', {slug: response.slug});
            }
          }, function (error) {

          });
      }).error(function (rep, status) {
        if (status === 401) {
          alert(rep.detail);
        }
        alert(JSON.stringify(rep));
        $localstorage.set('draft', JSON.stringify(data));
      });
    }
  })

  .controller('CreateEventCtrl', function ($scope, $localstorage, $cordovaToast, $http, $state, $filter) {
    $scope.event = {};
    $scope.create = function () {
      var token = $localstorage.get('token');
      var data = {
        content: $scope.event.content,
        date: $filter('date')(new Date(), 'yyyy-MM-dd'),
        location: $scope.event.location,
        pub_date: $filter('date')(new Date(), "yyyy-MM-dd'T'HH:mm:ssZ")
      };

      $http({
        method: 'POST',
        url: 'https://www.phodal.com/api/app/create/',
        data: data,
        headers: {
          'Authorization': 'JWT ' + token,
          'User-Agent': 'phodal/2.0 (iOS 8.1, Android 4.4)'
        }
      }).success(function (response) {
        $scope.event = {};
        $cordovaToast
          .show('Create Success', 'long', 'center')
          .then(function (response) {
            if (data.status === 2) {
              $state.go('app.blog-detail', {slug: response.slug});
            }
          }, function (error) {

          });
      }).error(function (rep, status) {
        if (status === 401) {
          alert(rep.detail);
        }
        $scope.event = data;
        alert(JSON.stringify(rep));
      });
    }
  });

function serialData(data) {
  var status = 1;
  if (data.status === true) {
    status = 2
  }

  return {
    title: data.title,
    content: data.content,
    slug: data.slug,
    publish_date: data.publish_date,
    status: status,
    user: 1
  };
}
