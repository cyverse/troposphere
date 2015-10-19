define(function (require) {
  "use strict";

  var React = require('react'),
      modals = require('modals'),
      globals = require('globals'),
      moment = require('moment'),
      stores = require('stores');

  return React.createClass({
    
    renderBadgeDetail: function(e){
      e.preventDefault();
      modals.BadgeModals.showMyBadge(this.props.badge);
    },
    
    getInitialState: function(){
      return({
            selected: false
        });
    },

    render: function () {
      var badge = this.props.badge,
          imageIdIndex = badge.get('imageUrl').lastIndexOf('/');
      return(
        <li className='badge-li'>
          <img className='image' src={globals.BADGE_IMAGE_HOST + badge.get('imageUrl').substring(imageIdIndex+1)} />
          <h4 className='badge-name'>{badge.get('name')}</h4>
          <p>{badge.get('strapline')}</p>
          <p><strong>Earned on:</strong><br/>{moment(this.props.badge.get('issuedOn')).format("L hh:mm a")}</p>
        </li>
      );
    }


  });

});
