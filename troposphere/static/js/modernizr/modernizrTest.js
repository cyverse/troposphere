define(function (require) {
   var modernizr = require('modernizr/modernizr-latest.js'),
       _ = require('underscore');

   var features = modernizr;
   var unsupportedFeatures = [];
   var breakingFeatures = [];
   var requiredFeatures = [
        //this we know we have support
        'cssanimations',
        //this we know we don't have support
        'regions',
        'microdata',
        'proximity',
        'display-runin',
        'mathml',
        'dart',
        //the actual tests so far we are concerned about
        'es5',
        'es5array',
        'es5date',
        'es5function',
        'es5object',
        'strictmode',
        'es5string',
        'json',
        'es5syntax',
        'es5undefined',
        'ruby',
        'svg',
        'flexbox',
        'inlinesvg',
        'cssgradients',
        'rgba',
        'eventlistener',
        'ellipsis'
    ];

    requiredFeatures.forEach(function(feat) {
        var feature = features[feat];
        if (feature === undefined)
            throw "can't find " + feat
        if (!feature)
            breakingFeatures.push(feat);
    });

    for (var prop in features){
        if (features.hasOwnProperty(prop)){
          console.log(prop + " " + features[prop]);
        if (features[prop] === false) {
          unsupportedFeatures.push(prop);
        }
      }
    };
  console.log("unsupported = " + unsupportedFeatures);

    console.log("breaking = " + breakingFeatures);
    var unsupported = function(){
                return breakingFeatures.length <= 0;
        };

    return {
        unsupportedFeatures: unsupportedFeatures,
        breakingFeatures: breakingFeatures,
        unsupported: unsupported,
    }

});

