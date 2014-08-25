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
      mocha: {
          exports: 'mocha'
      }
    }

  });

  define(function(require) {
    var chai = require('chai');
    var mocha = require('mocha');
    chai.should();

    mocha.setup('bdd');

    require(
      [
        'specs/sum',
        'specs/fail'
      ],
      function(require) {
        if (window.mochaPhantomJS) {
          mochaPhantomJS.run();
        }
        else {
          mocha.run();
        }
      }
    );

  });

})();