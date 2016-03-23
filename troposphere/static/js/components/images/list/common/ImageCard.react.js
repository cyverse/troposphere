define(function (require) {

  var React = require('react/addons'),
    Gravatar = require('components/common/Gravatar.react'),
    Backbone = require('backbone'),
    Bookmark = require('components/images/common/Bookmark.react'),
    context = require('context'),
    Tags = require('components/images/detail/tags/Tags.react'),
    stores = require('stores'),
    ImageCardDescription = require('./ImageCardDescription.react'),
    globals = require('globals'),
    moment = require('moment'),
    momentTZ = require('moment-timezone'),
    Router = require('react-router');

  return React.createClass({
    displayName: "ImageCard",

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    render: function () {
      var image = this.props.image,
        type = stores.ProfileStore.get().get('icon_set'),
        imageTags = stores.TagStore.getImageTags(image),
        imageCreationDate = moment(image.get('start_date'))
                                .tz(globals.TZ_REGION)
                                .format("MMM Do YYYY hh:mm a z"),
        hasUserLoggedIn = context.hasLoggedInUser(),
        iconSize = 145,
        icon;

      // always use the Gravatar icons
      icon = (
        <Gravatar hash={image.get('uuid_hash')} size={iconSize} type={type}/>
      );

      // Hide bookmarking on the public page
      var bookmark;
      if (hasUserLoggedIn) {
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
