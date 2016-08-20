import React from 'react';
import Router from 'react-router';
import Gravatar from 'components/common/Gravatar.react';
import Backbone from 'backbone';
import Bookmark from 'components/images/common/Bookmark.react';
import Tags from 'components/images/detail/tags/Tags.react';

import ImageCardDescription from './ImageCardDescription.react';
import context from 'context';
import globals from 'globals';
import moment from 'moment';
import stores from 'stores';


export default React.createClass({
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
        hasLoggedInUser = context.hasLoggedInUser(),
        iconSize = 145,
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
          {endDated}
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
