angular.module('starter.services', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    remove: function(key, defaultValue) {
      return $window.localStorage.removeItem([key]) || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('Blog', function($http, $q) {
  return {
	  async: function(api) {
		  var def = $q.defer();
      //$http.get(api)
      $http({
        method: 'GET',
        url: api,
        headers: {
          'User-Agent' : 'phodal/2.0 (iOS 8.1, Android 4.4) secret=75456d89c8a654'
        }
      })
      .success(function (response) {
        def.resolve(response);
      }).error(function (data, status) {
        def.reject("Failed to get albums");
      });
    return def.promise;
	  }
  };
});
