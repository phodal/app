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

.factory('Blog', function($http, $q) {
  var blog_api = 'https://www.phodal.com/api/v1/';
  return {
	  async: function(file_name) {
		  var def = $q.defer();
      $http.get(blog_api + file_name + '/?format=json')
			  .success(function (response) {
				  def.resolve(response);
			  }).error(function (data, status) {
				  def.reject("Failed to get albums");
			  });
		  return def.promise;
	  }
  };
});
