import React from 'react/addons';
import BadgeListCard from './BadgeListCard.react';

var BadgeList = React.createClass({

    propTypes: {
      title: React.PropTypes.string.isRequired,
      badges: React.PropTypes.any.isRequired
    },

    renderTitle: function () {
      var title = this.props.title;
      if (!title) return;

      return (
        <h3>{title}</h3>
      )
    },

    renderCard: function(badge){
      return (
        <li key={badge.id}>
          <BadgeListCard badge={badge}/>
        </li>
      );
    },

    render: function () {
      var badges = this.props.badges;
      var badgeCards = badges.map(this.renderCard);

      return (
        <div>
          {this.renderTitle()}
          <ul className='app-card-list'>
            {badgeCards}
          </ul>
        </div>
      );
    }

});

export default BadgeList;
