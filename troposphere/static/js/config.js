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
      '//cdnjs.cloudflare.com/ajax/libs/react/0.12.0/react-with-addons',
      '../bower_components/react/react-with-addons'
    ],
    'react-router': [
      'https://cdnjs.cloudflare.com/ajax/libs/react-router/0.11.6/react-router.min',
      //'https://cdn.rawgit.com/rackt/react-router/v0.12.4/build/global/ReactRouter.min',
      '../bower_components/react-router/dist/react-router'
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
      '//cdnjs.cloudflare.com/ajax/libs/highcharts/4.1.4/highcharts',
      '../bower_components/highcharts-release/highcharts'
    ],
    highcharts: [
      '//cdnjs.cloudflare.com/ajax/libs/highcharts/4.1.4/highcharts-more',
      '../bower_components/highcharts-release/highcharts-more.src'
    ],
    crypto: [
      '//crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5',
      'lib/md5'
    ],
    sinon: [
      '//cdnjs.cloudflare.com/ajax/libs/sinon.js/1.7.3/sinon-min',
      '../bower_components/sinon/lib/sinon'
    ],
    showdown: [
      "//cdnjs.cloudflare.com/ajax/libs/showdown/0.3.1/showdown.min"
    ]
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
    },

    react: {
      exports: 'React'
    },

    'globalize-react-hack': {
      deps: ['react'],
      exports: 'React'
    },

    'react-router': {
      deps: ['globalize-react-hack'],
      exports: 'ReactRouter'
    }
  }
});
