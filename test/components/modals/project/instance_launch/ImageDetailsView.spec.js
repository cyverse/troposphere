define(
  [
    'react',
    'components/modals/project/instance_launch/ImageDetailsView.react',
    'test/fixtures/image.fixture'
  ], function(React, ImageDetailsView, imageFixture) {

    var TestUtils,
        imageDetails;

    describe("Image Details View", function(){

      beforeEach(function() {
        TestUtils = React.addons.TestUtils;

        var factory = React.createFactory(ImageDetailsView);
        var view = factory({image: imageFixture});
        imageDetails = TestUtils.renderIntoDocument(view);
      });

      it("should display the image name", function(){
        var el = TestUtils.findRenderedDOMComponentWithClass(imageDetails, "name");
        expect(el.getDOMNode().textContent).toBe(imageFixture.get('name'));
      });

      it("should display the image description", function(){
        var el = TestUtils.findRenderedDOMComponentWithClass(imageDetails, "description");
        expect(el.getDOMNode().textContent).toBe(imageFixture.get('description'));
      });

      it("should display the image tags", function(){
        var tagList = TestUtils.findRenderedDOMComponentWithClass(imageDetails, "tags");
        var tags = TestUtils.scryRenderedDOMComponentsWithTag(tagList, "li");
        expect(tags.length).toBe(imageFixture.get('tags').length);
      });

    })

});
