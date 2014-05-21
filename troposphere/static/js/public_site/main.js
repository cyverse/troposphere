require.config({
  baseUrl: '/assets/js',
  paths: {
    jquery: '../bower_components/jquery/dist/jquery',
    backbone: '../bower_components/backbone/backbone',
    marionette: '../bower_components/backbone.marionette/lib/core/amd/backbone.marionette',
    'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr',
    'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
    underscore: '../bower_components/underscore/underscore',
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
    'public_site/bootstrapper'
  ],
  function (bootstrapper) {
    'use strict';

    bootstrapper.run();
  });
