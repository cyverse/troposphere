define(function (require) {

  var React = require('react'),
      Gravatar = require('components/common/Gravatar.react'),
      Backbone = require('backbone'),
      Bookmark = require('../../common/Bookmark.react'),
      context = require('context'),
      Tags = require('../../detail/tags/Tags.react'),
      stores = require('stores'),
      ImageCardDescription = require('./ImageCardDescription.react'),
      moment = require('moment'),
      Router = require('react-router');

  return React.createClass({

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    render: function () {
      var image = this.props.image,
          type = stores.ProfileStore.get().get('icon_set'),
          imageTags = stores.TagStore.getImageTags(image),
          imageCreationDate = moment(image.get('start_date')).format("MMM D, YYYY"),
          iconSize = 145,
          icon;

      if (image.get('icon')) {
        icon = (
          <img src={image.get('icon')} width={iconSize} height={iconSize}/>
        );
      } else {
        icon = (
          <Gravatar hash={image.get('uuid_hash')} size={iconSize} type={type}/>
        );
      }

      // Hide bookmarking on the public page
      var bookmark;
      if(context.profile){
        bookmark = (
          <Bookmark image={image}/>
        );
      }

      return (
        <div className='app-card'>
          <div className='icon-container'>
            <Router.Link to="image-details" params={{imageId: image.id}}>
              {icon}
            </Router.Link>
          </div>
          <div className='app-name'>
            <Router.Link to="image-details" params={{imageId: image.id}}>
              {image.get('name')}
            </Router.Link>
          </div>
          <div className="creation-details">
            <time>{imageCreationDate}</time> by <strong>{image.get('created_by').username}</strong>
          </div>
          {bookmark}
          <Tags activeTags={imageTags}
                tags={this.props.tags}
          />
          <ImageCardDescription image={image}/>
        </div>
      );
    }

  });

});
