//
//  Github Extension (WIP)
//  ~~strike-through~~   ->  <del>strike-through</del>
//

(function(){
  var images = function(converter) {
    return [
      { type: 'output', filter: function(source){
        return source.replace(/<img src="\/static\/(.*) \/>/gi, function(match, image) {
          return '<img src="https://www.phodal.com/static/' + image + ' />';
        });
      }}
    ];
  };

  // Client-side export
  if (typeof window !== 'undefined' && window.showdown && window.showdown.extensions) { window.showdown.extensions.images = images; }
  // Server-side export
  if (typeof module !== 'undefined') module.exports = images;
}());
