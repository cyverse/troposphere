define(function (require) {

  var React = require('react'),
    ApplicationCardList = require('./list/list/ApplicationCardList.react'),
    stores = require('stores');

  return React.createClass({

    renderBody: function () {
      var images = stores.ImageBookmarkStore.getBookmarkedImages(),
        tags = stores.TagStore.getAll();

      if (!images || !tags) return <div className='loading'></div>;

      if (images.length === 0) {
        return (
          <p>You have not favorited any images. Click the bookmark icon in the top right corner of an image to favorite
            it.</p>
        );
      }

      return (
        <ApplicationCardList applications={images}/>
      );
    },

    render: function () {
      return (
        <div className="container">
          {this.renderBody()}
        </div>
      );
    }

  });

});
