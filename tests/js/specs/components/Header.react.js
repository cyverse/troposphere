define(['squire', 'sinon'], function (Squire, sinon) {

  describe('Header', function () {
    var profile;

    beforeEach(function(){
      profile = {
        get: sinon.stub().withArgs("username").returns("testName")
      };
    });

    describe('when user is logged in', function () {
      it("should display the user's username", function (done) {
        var squire = new Squire();

        squire.require(['react', 'components/Header.react'], function (React, Header) {
          var TestUtils = React.addons.TestUtils;

          // arrange
          var header = TestUtils.renderIntoDocument(
            Header({profile: profile, currentRoute: "projects"})
          );

          // act
          var dropdown = $(header.getDOMNode()).find(".dropdown-toggle > span");

          // assert
          dropdown.text().should.equal("testName");
          done();
        });
      });

      describe('dropdown menu', function(){

        it("should display a drop-down with 3 options", function(done){
          var squire = new Squire();

          squire.require(['react', 'components/Header.react'], function (React, Header) {
            var TestUtils = React.addons.TestUtils;

            // arrange
            var header = $(TestUtils.renderIntoDocument(
              Header({profile: profile, currentRoute: "projects"})
            ).getDOMNode());

            // act
            var links = header.find(".dropdown-menu li a");

            // asset
            links.length.should.equal(3);
            done();
          });
        });

        it("should show version modal when version link is clicked", function(done){
          var squire = new Squire();

          var showVersionStub = sinon.stub();
          squire.mock('actions/VersionActions', {showVersion: showVersionStub});

          squire.require(['react', 'components/Header.react'], function (React, Header) {
            var TestUtils = React.addons.TestUtils;

            // arrange
            var header = $(TestUtils.renderIntoDocument(
              Header({profile: profile, currentRoute: "projects"})
            ).getDOMNode());

            // act
            var versionLink = header.find(".dropdown-menu li a")[1];
            TestUtils.Simulate.click(versionLink);

            // assert
            showVersionStub.calledOnce.should.be.true;
            done();
          });
        })
      })

    });

  });

});


//var profile = new Profile({username: "testName"});

// spy = observe only
// stub = spy + can override implementation (use to force code down a specific path)
//    sinon.stub(object, "method");
// can stub a method only for certain arguments
// mock = spies + stubs + pre-programmed behavior (will fail if gets different arguments than expected)
