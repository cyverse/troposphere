define(
  [
    'react',
    'components/modals/project/instance_launch/ImageList.react',
    'test/fixtures/images.fixture',
    'components/modals/project/instance_launch/Image.react'
  ], function(React, ImageList, imageCollectionFixture, Image) {

    var TestUtils,
        imageList;

    describe('Image List', function() {

      beforeEach(function() {
        TestUtils = React.addons.TestUtils;

        var modal = React.createElement(ImageList, {images: imageCollectionFixture});
        imageList = TestUtils.renderIntoDocument(modal);
      });

      it("should display a list of search results", function(){
        var liElements = TestUtils.scryRenderedComponentsWithType(imageList, Image);
        expect(liElements.length).toBe(imageCollectionFixture.length);
      });

    });

});
