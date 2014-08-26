define(function (require) {

  var React = require("react");
  var $ = require("jquery");
  var TestUtils = React.addons.TestUtils;
  var Header = require("components/Header.react");
  var sinon = require('sinon');
  var Profile = require('models/Profile');

  describe('React Test', function () {
    it("should pass", function () {

      var profile = new Profile({username: "testName"});

      var header = TestUtils.renderIntoDocument(
        Header({profile: profile, currentRoute: "projects"})
      );

      var dropdown = $(header.getDOMNode()).find(".dropdown-toggle > span");
      dropdown.text().should.equal("testName");
    });
  });

});