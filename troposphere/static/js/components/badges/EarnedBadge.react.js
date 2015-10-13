define(function (require) {
  "use strict";

  var React = require('react'),
      modals = require('modals'),
      stores = require('stores');

  return React.createClass({
    displayName: "EarnedBadge",

    renderBadgeDetail: function(e){
      e.preventDefault();
      modals.BadgeModals.showMyBadge(this.props.badge);
    },

    getInitialState: function(){
      var badgeText = this.props.badge.get('strapline');

      return({
        text: badgeText,
        badgeSlug: this.props.badge.get('slug')
      });
    },

    render: function () {
      var badge = this.props.badge;

      return(
        <li onClick={this.renderBadgeDetail} className='badge-li'>
          <img className='image' src={badge.get('imageUrl')} />
          <h4 className='badge-name'>{badge.get('name')}</h4>
          <p className='text'>
          {this.state.text}
          </p>
        </li>
      );
    }


  });

});
