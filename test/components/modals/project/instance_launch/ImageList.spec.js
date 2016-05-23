define(
  [
    'react',
    'common/image/ImageList.react',
    'test/fixtures/images.fixture',
    'components/modals/project/instance_launch/Image.react'
  ], function(React, ImageList, imageCollectionFixture, Image) {

    var TestUtils = require('react-addons-test-utils'),
        imageList;

    describe('Image List', function() {

      beforeEach(function() {
        var modal = React.createElement(ImageList, {images: imageCollectionFixture});
        imageList = TestUtils.renderIntoDocument(modal);
      });

      it("should display a list of search results", function(){
        var liElements = TestUtils.scryRenderedComponentsWithType(imageList, Image);
        expect(liElements.length).toBe(imageCollectionFixture.length);
      });

    });

});
