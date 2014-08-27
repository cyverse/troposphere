require.config({
  baseUrl: '../../troposphere/troposphere/assets/js',

  paths: {
    react: '../bower_components/react/react-with-addons',
    jquery: '../bower_components/jquery/dist/jquery',
    underscore: '../bower_components/underscore/underscore',
    backbone: '../bower_components/backbone/backbone',
    moment: '../bower_components/moment/moment',
    q: '../bower_components/q/q',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',

    specs: '../../../tests/js/specs',

    chai: "../../../node_modules/chai/chai",
    mocha: "../../../node_modules/mocha/mocha",
    sinon: "../../../node_modules/sinon/lib/sinon",
    squire: "../../../node_modules/squirejs/src/Squire"
    //jsx: '../../troposphere/static/bower_components/require-jsx/jsx',
    //JSXTransformer: '../../troposphere/static/bower_components/react/JSXTransformer'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    mocha: {
      exports: 'mocha'
    },
    bootstrap: {
      deps: ['jquery']
    }
  }
});

define(function (require) {
  var chai = require('chai');
  var mocha = require('mocha');
  chai.should();

  mocha.setup('bdd');

  require(
    [
      //'specs/sum',
      //'specs/fail',
      //'specs/react',
      'specs/squire'
    ],
    function (require) {
      if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
      }
      else {
        mocha.run();
      }
    }
  );

});
