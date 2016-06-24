import _ from 'underscore';

/**
 * Author: Eugene Cheltsov
 * Source: https://gist.github.com/ChillyBwoy/992303
 * License: none indicated
 */

function findAllCookies() {
    var cookies = {};
    _(document.cookie.split(';'))
        .chain()
        .map(function(m) {
            return m.replace(/^\s+/, '').replace(/\s+$/, '');
        })
        .each(function(c) {
            var arr = c.split('='),
                key = arr[0],
                value = null;
            var size = _.size(arr);
            if (size > 1) {
                value = arr.slice(1).join('');
            }
            cookies[key] = _.escape(value);
        });
    return cookies;
}

function findCookie(cookieName) {
    var cookie = null,
        list = findAllCookies();

    _.each(list, function(value, key) {
        if (key === cookieName) {
            cookie = _.unescape(value);
        }
    });
    return cookie;
}

export {findCookie, findAllCookies};
