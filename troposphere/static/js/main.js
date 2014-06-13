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
    jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
    backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
    marionette: '//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/1.8.6/core/amd/backbone.marionette.min',
    'backbone.wreqr': '//cdnjs.cloudflare.com/ajax/libs/backbone.wreqr/0.1.0/backbone.wreqr.min',
    'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
    underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
    google: 'https://www.google.com/jsapi',
    bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/js/bootstrap.min',
    moment: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min',
    react: '//cdnjs.cloudflare.com/ajax/libs/react/0.10.0/react-with-addons',
    rsvp: '//cdn.jsdelivr.net/rsvp/3.0/rsvp.amd.min',
    chosen: '//cdnjs.cloudflare.com/ajax/libs/chosen/1.1.0/chosen.jquery.min',
    toastr: '//cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.2/js/toastr.min'
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
