require.config({
  baseUrl: '/assets/js',
  paths: {
    // Path fallbacks syntax:
    // https://github.com/jrburke/requirejs/wiki/Upgrading-to-RequireJS-2.0#paths-fallbacks-
    //
    // jquery: [
    //    'http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min',
    //    'lib/jquery' <---- If the CDN location fails, load from this location
    //]
    jquery: [
      '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
      '../bower_components/jquery/dist/jquery'
    ],
    backbone: [
      '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
      '../bower_components/backbone/backbone'
    ],
    marionette: [
      '//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/1.8.6/core/amd/backbone.marionette.min',
      '../bower_components/backbone.marionette/lib/core/backbone.marionette'
    ],
    'backbone.wreqr': [
      '//cdnjs.cloudflare.com/ajax/libs/backbone.wreqr/0.1.0/backbone.wreqr.min',
      '../bower_components/backbone.wreqr/lib/backbone.wreqr'
    ],
    'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
    underscore: [
      '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
      '../bower_components/underscore/underscore'
    ],
    bootstrap: [
      '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/js/bootstrap.min',
      '../bower_components/bootstrap/dist/js/bootstrap.min'
    ],
    moment: [
      '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min',
      '../bower_components/moment/moment'
    ],
    react: [
      '//cdnjs.cloudflare.com/ajax/libs/react/0.12.0/react-with-addons.min',
      '../bower_components/react/react-with-addons'
    ],
    chosen: [
      '//cdnjs.cloudflare.com/ajax/libs/chosen/1.1.0/chosen.jquery.min',
      '../bower_components/chosen/chosen.jquery'
    ],
    toastr: [
      '//cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.2/js/toastr.min',
      '../bower_components/toastr/toastr'
    ],
    q: [
      '//cdnjs.cloudflare.com/ajax/libs/q.js/1.0.1/q.min',
      '../bower_components/q/q'
    ],
    highchartsBase: [
      '//code.highcharts.com/highcharts',
      '../bower_components/highcharts-release/highcharts'
    ],
    highcharts: [
      '//code.highcharts.com/highcharts-more',
      '../bower_components/highcharts-release/highcharts-more'
    ],
    crypto: [
      '//crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5',
      'lib/md5'
    ],
    sinon: [
      '//cdnjs.cloudflare.com/ajax/libs/sinon.js/1.7.3/sinon-min',
      '../bower_components/sinon/lib/sinon'
    ],
    showdown: "//cdnjs.cloudflare.com/ajax/libs/showdown/0.3.1/showdown.min"
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
    },

    highchartsBase: {
      deps: ['jquery']
    },

    highcharts: {
      deps: ['highchartsBase'],
      exports: 'Highcharts'
    },

    crypto: {
      exports: 'CryptoJS'
    },

    sinon: {
      exports: 'sinon'
    }
  }
});
