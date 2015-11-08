import modernizr from 'lib/modernizr-latest.js';
import _ from 'underscore';

let features = modernizr;

let requiredFeatures = [
    //this we know we don't have support
    //'regions',
    //'microdata',
    //'proximity',
    //'display-runin',
    //'mathml',
    //'dart',
    //the actual tests, so far, we are concerned about
    'cssanimations',
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

let unsupportedFeatures = _.map(_.filter(_.pairs(features), _.negate(_.last)), _.first);
let breakingFeatures = _.intersection(requiredFeatures, unsupportedFeatures);

let unsupported = function() {
    return breakingFeatures.length <= 0;
};

export default {
        unsupportedFeatures: unsupportedFeatures,
        breakingFeatures: breakingFeatures,
        unsupported: unsupported,
};
