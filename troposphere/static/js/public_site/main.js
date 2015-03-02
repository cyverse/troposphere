require.config({
  baseUrl: '/assets/js',
  paths: {
    jquery: ['//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min'],
    backbone: ['//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min'],
    underscore: ['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min'],
    bootstrap: ['//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/js/bootstrap.min'],
    moment: ['//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min'],
    react: ['//cdnjs.cloudflare.com/ajax/libs/react/0.12.0/react-with-addons.min'],
    'react-router': ['https://cdnjs.cloudflare.com/ajax/libs/react-router/0.11.6/react-router.min'],
    chosen: ['//cdnjs.cloudflare.com/ajax/libs/chosen/1.1.0/chosen.jquery.min'],
    toastr: ['//cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.2/js/toastr.min'],
    q: ['//cdnjs.cloudflare.com/ajax/libs/q.js/1.0.1/q.min'],
    crypto: ['//crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5'],
    showdown: ['//cdnjs.cloudflare.com/ajax/libs/showdown/0.3.1/showdown.min']
  },
  shim: {
    underscore: {
      exports: '_'
    },

    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },

    bootstrap: {
      deps: ['jquery']
    },

    chosen: {
      deps: ['jquery']
    },

    crypto: {
      exports: 'CryptoJS'
    },

    react: {
      exports: 'React'
    },

    'globalize-react-hack': {
      deps: ['react']
    },

    'react-router': {
      deps: ['globalize-react-hack'],
      exports: 'ReactRouter'
    }
  }
});

require(
  [
    './bootstrapper.react'
  ],
  function (bootstrapper) {
    'use strict';

    bootstrapper.run();
  });
