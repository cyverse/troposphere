define(function (require) {
  "use strict";

  var React = require('react'),
      modals = require('modals'),
      globals = require('globals'),
      stores = require('stores');

  return React.createClass({
    displayName: "Badge",

    getInitialState: function(){
      return({
        text: this.props.type == "earned" ? this.props.badge.get('strapline') : this.props.badge.get('criteria')[0].description,
        badgeSlug: this.props.badge.get('slug')
      });
    },

    render: function () {
      var badge = this.props.badge,
          // We get the badge image ID from the image URL, since the badge ID is not guaranteed to be the badge image ID
          badgeImagePieces = badge.get('imageUrl').split('/'),
          badgeImageId = badgeImagePieces[badgeImagePieces.length - 1];

      return(
        <li className='badge-li'>
          <img className='image' src={globals.BADGE_IMAGE_HOST + badgeImageId} />
          <h4 className='badge-name'>{badge.get('name')}</h4>
          <p className='text'>
          {this.state.text}
          </p>
        </li>
      );
    }


  });

});
