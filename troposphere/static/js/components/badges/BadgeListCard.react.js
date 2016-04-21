import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import globals from 'globals';
import moment from 'moment';

var BadgeListCard = React.createClass({
    displayName: "BadgeListCard",

    propTypes: {
      badge: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function(){
      return({
        text: this.props.badge.get('strapline'),
        badgeSlug: this.props.badge.get('slug')
      });
    },

    render: function () {
        var badge = this.props.badge,
        // We get the badge image ID from the image URL, since the badge ID is not guaranteed to be the badge image ID
        badgeImagePieces = badge.get('imageUrl').split('/'),
        badgeImageId = badgeImagePieces[badgeImagePieces.length - 1],
        earnedText,
        classNames = "app-card";
        if(stores.MyBadgeStore.has(badge.id)){
            classNames += " earned";
            earnedText = <strong>{"Earned on " + moment(stores.MyBadgeStore.get(badge.id).get('issuedOn')).format("MMM Do, YYYY h:mm a")}</strong>;
        }
        var icon = (
          <img className="badge-image" src={globals.BADGE_IMAGE_HOST + badgeImageId} />
        );

      var criteria = badge.get('criteria').map(function(item){
        return <li key={item.id}>{item.description}</li>
      });

      return (
        <div className={classNames}>
          <div>
            <span className='icon-container'>
                {icon}
            </span>
            <span className='app-name'>
              <h4>
                  {badge.get('name')}
              </h4>
              <div>{this.state.text}</div>
              <strong>Criteria:</strong>
              <ul>
                {criteria}
              </ul>
              {earnedText}
              </span>
          </div>
        </div>
      );
    }

});

export default BadgeListCard;
