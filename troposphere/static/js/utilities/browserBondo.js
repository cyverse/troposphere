//import Raven from "raven-js";

// NOTE: with error reports from Sentry using their client, Raven,
// we have determined that the following Array methods are not
// present on `Array.prototype` within browsers used by some
// community members. This is a temporary approach for ensuring that
// methods are available. These implementations add no *new*
// dependencies.

// Polyfill implementations from Mozilla Developer Network (MDN)
// documentation

function conditionalFill() {
    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Polyfill
    if (!Array.prototype.includes) {
        Array.prototype.includes = function(searchElement /*, fromIndex*/) {
            'use strict';
            if (this == null) {
                throw new TypeError('Array.prototype.includes called on null or undefined');
            }

            var O = Object(this);
            var len = parseInt(O.length, 10) || 0;
            if (len === 0) {
                return false;
            }
            var n = parseInt(arguments[1], 10) || 0;
            var k;
            if (n >= 0) {
                k = n;
            } else {
                k = len + n;
                if (k < 0) {k = 0;}
            }
            var currentElement;
            while (k < len) {
                currentElement = O[k];
                if (searchElement === currentElement ||
                    (searchElement !== searchElement && currentElement !== currentElement)) {
                    // NaN !== NaN
                    return true;
                }
                k++;
            }
            return false;
        };
    }

    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex#Polyfill
    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function(predicate) {
                'use strict';
                if (this == null) {
                    throw new TypeError(
                        'Array.prototype.findIndex called on null or undefined');
                }
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                var list = Object(this);
                var length = list.length >>> 0;
                var thisArg = arguments[1];
                var value;

                for (var i = 0; i < length; i++) {
                    value = list[i];
                    if (predicate.call(thisArg, value, i, list)) {
                        return i;
                    }
                }
                return -1;
            },
            enumerable: false,
            configurable: false,
            writable: false
        });
    }

}

export default { conditionalFill };
