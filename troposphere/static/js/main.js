require.config({
  baseUrl: '/assets/js',
  paths: {
    /* TODO: use minified versions in production */
    jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery',
    backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
    marionette: '../bower_components/backbone.marionette/lib/core/amd/backbone.marionette',
    'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr',
    'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
    underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
    google: 'https://www.google.com/jsapi',
    bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/js/bootstrap',
    moment: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min',
    react: '//cdnjs.cloudflare.com/ajax/libs/react/0.10.0/react',
    rsvp: '//cdn.jsdelivr.net/rsvp/3.0/rsvp.amd.min'
  },
  shim: {
    underscore: {
      exports: '_'
    },

    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },

    marionette: {
      deps: ['backbone'],
      exports: 'Marionette'
    },

    bootstrap: {
      deps: ['jquery']
    }
  }
});

require(
  [
    'bootstrapper'
  ],
  function (bootstrapper) {
    'use strict';

    bootstrapper.run();
  });
