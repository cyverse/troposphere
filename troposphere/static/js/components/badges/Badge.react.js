define(function (require) {
  "use strict";

  var React = require('react'),
      modals = require('modals'),
      globals = require('globals'),
      stores = require('stores');

  return React.createClass({
    renderBadgeDetail: function(e){
      e.preventDefault();
      modals.BadgeModals.showBadge(this.props.badge);
    },

    getInitialState: function(){
      var badgeText = this.props.badge.get('criteria')[0].description;
      return({
        text: badgeText,
        badgeSlug: this.props.badge.get('slug')
      });
    },

    render: function () {
      var badge = this.props.badge,
          // We get the badge image ID from the image URL, since the badge ID is not guaranteed to be the badge image ID
          imageIdIndex = badge.get('imageUrl').lastIndexOf('/');
      return(
        <li onClick={this.renderBadgeDetaiil} className='badge-li'>
          <img className='image' src={globals.BADGE_IMAGE_HOST + badge.get('imageUrl').substring(imageIdIndex+1)} />
          <h4 className='badge-name'>{badge.get('name')}</h4>
          <p className='text'>
          {this.state.text}
          </p>
        </li>
      );
    }


  });

});
