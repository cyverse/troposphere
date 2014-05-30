require.config({
  baseUrl: '/assets/js',
  paths: {
    // Path fallbacks syntax:
    // https://github.com/jrburke/requirejs/wiki/Upgrading-to-RequireJS-2.0#paths-fallbacks-
    //
    // jquery: [
    //    'http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min',
    //    //If the CDN location fails, load from this location
    //    'lib/jquery'
    //]
    jquery: '../bower_components/jquery/dist/jquery',
    backbone: '../bower_components/backbone/backbone',
    marionette: '../bower_components/backbone.marionette/lib/core/amd/backbone.marionette',
    'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr',
    'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
    underscore: '../bower_components/underscore/underscore',
    google: 'https://www.google.com/jsapi',
    bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/js/bootstrap',
    moment: '../bower_components/moment/moment',
    react: '../bower_components/react/react-with-addons',
    rsvp: '../bower_components/rsvp/rsvp.amd',
    chosen: '../bower_components/chosen/chosen.jquery'
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
    },

    chosen: {
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
