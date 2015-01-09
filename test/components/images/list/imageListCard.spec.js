define(function(require) {

    var React = require('react');
    var actions = require('actions');
    var stores = require('stores');
    var ImageListCard = require('components/applications/common/ApplicationListCard.react');
    var imageFixture = require('test/fixtures/image.fixture');
    var profileFixture = require('test/fixtures/profile.fixture');
    var tagCollectionFixture = require('test/fixtures/tags.fixture');
    var navigator = require('navigator');

    var TestUtils,
        imageCardElement;

    describe('Image List Card', function() {

      beforeEach(function() {
        TestUtils = React.addons.TestUtils;

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

        navigator.navigateTo = sinon.spy();

        var imageCardView = ImageListCard({application: imageFixture});
        imageCardElement = TestUtils.renderIntoDocument(imageCardView);
      });

      it("should navigate to image details page when user clicks on the image", function(){
        var image = TestUtils.scryRenderedDOMComponentsWithTag(imageCardElement, "img");
        TestUtils.Simulate.click(image[0]);
        expect(navigator.navigateTo.calledOnce).toBe(true);
      });

      it("should show image tags", function(){
        var tags = TestUtils.scryRenderedDOMComponentsWithTag(imageCardElement, "li");
        expect(tags.length).toBe(tagCollectionFixture.length);
      });

      it("should show image author", function(){
        var authorTag = TestUtils.scryRenderedDOMComponentsWithTag(imageCardElement, "strong");
        expect(authorTag.length).toBe(1);
        expect(authorTag[0].getDOMNode().textContent).toBe(imageFixture.get('created_by'));
      });

      it("should show image description", function(){
        var description = TestUtils.scryRenderedDOMComponentsWithTag(imageCardElement, "p");
        expect(description.length).toBe(1);
        expect(description[0].getDOMNode().textContent).toBe(imageFixture.get('description'));
      });

      it("should show star status", function(){
        var star = TestUtils.scryRenderedDOMComponentsWithClass(imageCardElement, "bookmark");
        expect(star.length).toBe(1);
      });

//      describe("star button", function(){
//
//        var starElement;
//
//        beforeEach(function(){
//          starElement = TestUtils.findRenderedDOMComponentWithClass(imageCardElement, "bookmark");
//        });
//
//        iit("should change state when user clicks on it", function(){
//          var img = TestUtils.scryRenderedDOMComponentsWithTag(starElement, "img")[0];
//          expect(img.getDOMNode().attributes["src"].value).toBe("/assets/images/empty-star-icon.png");
//          TestUtils.Simulate.click(starElement);
//          expect(img.getDOMNode().attributes["src"].value).toBe("/assets/images/filled-star-icon.png");
//        })
//      })

    });

});
