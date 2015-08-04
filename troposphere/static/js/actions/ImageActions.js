define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      ImageConstants = require('constants/ImageConstants');

  return {

    updateImageAttributes: function (image, newAttributes) {
      image.set({
        name: newAttributes.name,
        description: newAttributes.description,
      });
      AppDispatcher.handleRouteAction({
        actionType: ImageConstants.IMAGE_UPDATE,
        payload: {image: image}
      });
    }

  };

});
