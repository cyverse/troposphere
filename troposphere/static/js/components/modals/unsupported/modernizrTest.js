   var modernizr = require('lib/modernizr-latest.js'),
       _ = require('underscore');
   var features = modernizr;

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

    var unsupportedFeatures = _.map(_.filter(_.pairs(features), _.negate(_.last)), _.first);
    var breakingFeatures = _.intersection(requiredFeatures, unsupportedFeatures);

    console.log("Unsupported = " + unsupportedFeatures);
    console.log("Breaking Bad = " + breakingFeatures);

    var unsupported = function(){
                return breakingFeatures.length <= 0;
        };

    module.exports =  {
        unsupportedFeatures: unsupportedFeatures,
        breakingFeatures: breakingFeatures,
        unsupported: unsupported,
    }


