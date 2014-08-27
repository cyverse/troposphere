define(function (require) {

  var React = require("react");
  var $ = require("jquery");
  var TestUtils = React.addons.TestUtils;
  var Header = require("components/Header.react");
  var sinon = require('sinon');

  describe('Header', function () {

    describe('logged in', function () {
      it("should display username when user logged in", function () {

        //var profile = new Profile({username: "testName"});

        // spy = observe only
        // stub = spy + can override implementation (use to force code down a specific path)
        //    sinon.stub(object, "method");
        // can stub a method only for certain arguments
        // mock = spies + stubs + pre-programmed behavior (will fail if gets different arguments than expected)

        var profile = {};
        profile.get = sinon.mock()
          .withExactArgs("username")
          .returns("testName");

        var header = TestUtils.renderIntoDocument(
          Header({profile: profile, currentRoute: "projects"})
        );

        var dropdown = $(header.getDOMNode()).find(".dropdown-toggle > span");
        dropdown.text().should.equal("testName");
      });

      it("should provide a login button when user is not logged in");
    });

    describe('navigation bar', function () {
      it("should highlight the active route");
      it("should not highlight inactive routes");
    });


  });

  var Profile = require('models/Profile');

});