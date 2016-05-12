define(function (require) {

  var React = require('react/addons'),
    Gravatar = require('components/common/Gravatar.react'),
    Backbone = require('backbone'),
    Bookmark = require('components/images/common/Bookmark.react'),
    context = require('context'),
    Tags = require('components/images/detail/tags/Tags.react'),
    stores = require('stores'),
    Showdown = require('showdown'),
    globals = require('globals'),
    moment = require('moment'),
    momentTZ = require('moment-timezone'),
    Router = require('react-router');

  return React.createClass({
    displayName: "ImageListCard",

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var image = this.props.image,
        hasLoggedInUser = context.hasLoggedInUser(),
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
      let endDated;
      if (this.props.isEndDated) {
        endDated = (
            <div style={{
                position: "absolute",
                top: "10px",
                left: "0",
                background: "#F55A5A",
                display: "inline-block",
                padding: "5px 10px",
                color: "white"
              }}
            >
              End Dated
            </div>
        );
      }
      if (hasLoggedInUser) {
        bookmark = (
          <Bookmark image={image}/>
        );
      }

      return (
        <div className='app-card'>
          <div>
            {endDated}
            <span className='icon-container'>
              <Router.Link to="image-details" params={{imageId: image.id}}>
                {icon}
              </Router.Link>
            </span>
            <span className='app-name'>
              <h4>
                <Router.Link to="image-details" params={{imageId: image.id}}>
                  {image.get('name')}
                </Router.Link>
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
