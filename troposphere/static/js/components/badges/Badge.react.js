import React from 'react';
import modals from 'modals';

export default React.createClass({
    displayName: "Badge",

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
