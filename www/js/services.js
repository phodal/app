angular.module('starter.services', [])

.factory("transformRequestAsFormPost", function() {
    function transformRequest( data, getHeaders ) {
      var headers = getHeaders();
      headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";
      return( serializeData( data ) );
    }
    return( transformRequest );
    function serializeData( data ) {
      if ( ! angular.isObject( data ) ) {
        return( ( data == null ) ? "" : data.toString() );
      }
      var buffer = [];
      for ( var name in data ) {
        if ( ! data.hasOwnProperty( name ) ) {
          continue;
        }
        var value = data[ name ];
        buffer.push(
          encodeURIComponent( name ) + "=" + encodeURIComponent( ( value == null ) ? "" : value )
        );
      }
      var source = buffer.join( "&" ).replace( /%20/g, "+" );
      return( source );
    }
  }
)

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
