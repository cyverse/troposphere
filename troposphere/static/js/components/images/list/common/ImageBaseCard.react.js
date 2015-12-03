define(function (require) {

  var React = require('react/addons'),
    Gravatar = require('components/common/Gravatar.react'),
    Backbone = require('backbone'),
    Bookmark = require('components/images/common/Bookmark.react'),
    context = require('context'),
    Tags = require('components/images/detail/tags/Tags.react'),
    stores = require('stores'),
    navigator = require('navigator'),
    Showdown = require('showdown'),
    globals = require('globals'),
    moment = require('moment'),
    momentTZ = require('moment-timezone'),
    Router = require('react-router');

  return React.createClass({
    displayName: "ImageBaseCard",

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var image = this.props.image,
        type = stores.ProfileStore.get().get('icon_set'),
        imageTags = stores.TagStore.getImageTags(image),
        imageCreationDate = moment(image.get('start_date'))
                                .tz(globals.TZ_REGION)
                                .format("MMM Do YYYY hh:mm a z"),
        converter = new Showdown.Converter(),
        description = image.get('description');
      if(!description) {
          description = "No Description Provided."
      }
      var descriptionHtml = converter.makeHtml(description),
        iconSize = 67,
        icon;

      // always use the Gravatar icons
      icon = (
        <Gravatar hash={image.get('uuid_hash')} size={iconSize} type={type}/>
      );

      // Hide bookmarking on the public page
      var bookmark;
      if (context.profile) {
        bookmark = (
          <Bookmark image={image}/>
        );
      }

      return (
        <div className='app-card'>
          <div>
            <span className='icon-container'>
                {icon}
            </span>
            <span className='app-name'>
              <h4>
                  {image.get('name')}
              </h4>
              <div><time>{imageCreationDate}</time> by <strong>{image.get('created_by').username}</strong></div>
              <Tags activeTags={imageTags}/>
            </span>
          </div>
          <div dangerouslySetInnerHTML={{__html: descriptionHtml}}/>
          {bookmark}
        </div>
      );
    }

  });

});
