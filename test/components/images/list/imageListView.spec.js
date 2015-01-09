define(function(require) {

    var React = require('react');
    var actions = require('actions');
    var stores = require('stores');
    var ImageListView = require('components/applications/list/ApplicationListView.react');
    var ApplicationCardList = require('components/applications/list/ApplicationCardList.react');
    var ApplicationCardGrid = require('components/applications/list/ApplicationCardGrid.react');
    var SecondaryApplicationNavigation = require('components/applications/common/SecondaryApplicationNavigation.react');

    var imageCollectionFixture = require('test/fixtures/projects.fixture');
    var tagCollectionFixture = require('test/fixtures/tags.fixture');
    var profileFixture = require('test/fixtures/profile.fixture');

    var TestUtils,
        imageViewElement;

    describe('Image List View', function() {

      beforeEach(function() {
        TestUtils = React.addons.TestUtils;

//        var mockComponent = function (component, mockTagName) {
//          var reactClass = React.createClass({
//                render: function () {
//                  var mockTagName = mockTagName || "div";
//                  return React.DOM[mockTagName](null, this.props.children);
//                }
//              }),
//              mock = sinon.stub(component, reactClass);
//          return mock;
//        };

        var mockComponent = TestUtils.mockComponent(SecondaryApplicationNavigation);

        var listView = ImageListView({applications: imageCollectionFixture});
        imageViewElement = TestUtils.renderIntoDocument(listView);

        for(var action in actions) delete actions[action];
        for(var store in stores) delete stores[store];

        stores.ProfileStore = {
          get: function () {
            return profileFixture;
          }
        };

        stores.TagStore = {
          getImageTags: function(){
            return tagCollectionFixture;
          }
        };
      });

      it("should have secondary navigation", function(){
        var elements = TestUtils.scryRenderedComponentsWithType(imageViewElement, SecondaryApplicationNavigation);
        expect(elements.length).toBe(1);
      });

      describe("when no images or tags", function(){

        beforeEach(function() {
          var listView = ImageListView({
            applications: null,
            tags: null
          });
          imageViewElement = TestUtils.renderIntoDocument(listView);
        });

        it("should display a loading icon", function(){
          var elements = TestUtils.scryRenderedDOMComponentsWithClass(imageViewElement, "loading");
          expect(elements.length).toBe(1);
        });
      });

      describe("with images and tags", function(){

        beforeEach(function() {
          var listView = ImageListView({
            applications: imageCollectionFixture,
            tags: tagCollectionFixture
          });
          imageViewElement = TestUtils.renderIntoDocument(listView);
        });

        it("should not display a loading icon", function(){
          var elements = TestUtils.scryRenderedDOMComponentsWithClass(imageViewElement, "loading");
          expect(elements.length).toBe(0);
        });

        it("should display a list of images", function(){
          var elements = TestUtils.scryRenderedComponentsWithType(imageViewElement, ApplicationCardList);
          expect(elements.length).toBe(2); // 1 for featured images, 1 for all images
        });

        it("should have a button to change the view type", function(){
            var elements = TestUtils.scryRenderedDOMComponentsWithClass(imageViewElement, "btn-group");
            expect(elements.length).toBe(1);
          });

        describe("view type button", function(){

          var buttonGroup;

          beforeEach(function() {
            buttonGroup = TestUtils.findRenderedDOMComponentWithClass(imageViewElement, "btn-group");
          });

          it("should have two buttons", function(){
            var elements = TestUtils.scryRenderedDOMComponentsWithTag(buttonGroup, "button");
            expect(elements.length).toBe(2);
          });

          describe("first button", function(){

            var firstButton;

            beforeEach(function() {
              var buttons = TestUtils.scryRenderedDOMComponentsWithTag(buttonGroup, "button");
              firstButton = buttons[0];
            });

            it("should display the correct icon", function(){
              var icons = TestUtils.scryRenderedDOMComponentsWithClass(firstButton, "glyphicon-align-justify");
              expect(icons.length).toBe(1);
            });

            it("should say List", function(){
              expect(firstButton.getDOMNode().textContent).toBe(" List");
            });

            it("should be active by default", function(){
              expect(firstButton.getDOMNode().className).toBe("btn btn-default active");
            });

          });

          describe("second button", function(){

            var firstButton;

            beforeEach(function() {
              var buttons = TestUtils.scryRenderedDOMComponentsWithTag(buttonGroup, "button");
              firstButton = buttons[1];
            });

            it("should display the correct icon", function(){
              var icons = TestUtils.scryRenderedDOMComponentsWithClass(firstButton, "glyphicon-th");
              expect(icons.length).toBe(1);
            });

            it("should say List", function(){
              expect(firstButton.getDOMNode().textContent).toBe(" Grid");
            });

            it("should be inactive by default", function(){
              expect(firstButton.getDOMNode().className).toBe("btn btn-default");
            });

          });

          describe("when user presses grid button", function(){

            var listButton, gridButton;

            beforeEach(function() {
              var buttons = TestUtils.scryRenderedDOMComponentsWithTag(buttonGroup, "button");
              listButton = buttons[0];
              gridButton = buttons[1];
              TestUtils.Simulate.click(gridButton);
            });

            it("should make the grid button active", function(){
              expect(gridButton.getDOMNode().className).toBe("btn btn-default active");
            });

            it("should make the list button inactive", function(){
              expect(listButton.getDOMNode().className).toBe("btn btn-default");
            });

            it("should display the grid view", function(){
              var elements = TestUtils.scryRenderedComponentsWithType(imageViewElement, ApplicationCardGrid);
              expect(elements.length).toBe(2); // 1 for featured images, 1 for all images
            })
          });

        })

      })

    });

});
