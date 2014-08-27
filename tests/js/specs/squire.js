define(['squire', 'sinon', 'react', 'jquery'], function(Squire, sinon, React, $) {
  var TestUtils = React.addons.TestUtils;

  var injector = new Squire();

  injector.mock('actions/VersionActions', function(){
    console.log("called version actions");
  });

  injector.require([
    'components/Header.react'
  ],
  function(Header){


    describe('Squire Header', function () {
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
      });

    });

  });

});