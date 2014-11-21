define(
  [
    'react',
    'components/modals/project/instance_launch/Image.react',
    'test/fixtures/image.fixture'
  ], function(React, Image, imageFixture) {

    var TestUtils,
        imageElement;

    ddescribe('Image List', function() {

      beforeEach(function() {
        TestUtils = React.addons.TestUtils;

        var image = React.createElement(Image, {image: imageFixture});
        imageElement = TestUtils.renderIntoDocument(image);
      });

      it("should be a single li element", function(){
        TestUtils.findRenderedDOMComponentWithTag(imageElement, "li");
      });

      it("should display the image name", function(){
        var el = TestUtils.findRenderedDOMComponentWithClass(imageElement, "name");
        expect(el.getDOMNode().textContent).toBe(imageFixture.get('name'));
      });

      it("should display the image description", function(){
        var el = TestUtils.findRenderedDOMComponentWithClass(imageElement, "description");
        expect(el.getDOMNode().textContent).toBe(imageFixture.get('description'));
      });

    });

});
