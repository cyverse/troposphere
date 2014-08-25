(function () {

  require.config({
    baseUrl: './js',
    paths: {
      react: '../../troposphere/static/bower_components/react/react-with-addons',
      components: '../../troposphere/static/js/components',
      chai: "../../node_modules/chai/chai",
      mocha: "../../node_modules/mocha/mocha"
    },
    shim: {
      // underscore: {
      //   deps: [],
      //   exports: '_'
      // },
      // backbone: {
      //   deps: ['jquery', 'underscore'],
      //   exports: 'Backbone'
      // }
      mocha: {
          exports: 'mocha'
      }
    }

  });

  define(function(require) {
    var chai = require('chai');
    var mocha = require('mocha');
    var should = chai.should();

    mocha.setup('bdd');

    require(
      [
        'specs/sum'
      ],
      function(require) {
        mocha.run();
      }
    );

  });

})();