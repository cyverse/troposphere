define(function (require) {
  "use strict";

  var React = require('react'),
      modals = require('modals'),
      globals = require('globals'),
      moment = require('moment'),
      stores = require('stores');

  return React.createClass({
    displayName: "EarnedBadge",

    renderBadgeDetail: function(e){
        e.preventDefault();
        modals.BadgeModals.showMyBadge(this.props.badge);
    },

    handleClick: function(e){
        this.setState({selected: !this.state.selected});
    },

    getInitialState: function(){
      return({
            selected: false
        });
    },

    addToBackpack: function(){
        OpenBadges.issue(this.props.badge.get('assertionUrl'));
    },

    render: function () {
      var badge = this.props.badge;
      var content = (
              <p>{badge.get('strapline')}</p>
      );
      if(this.state.selected){
        content = (
            <div className="text">
            <p>{badge.get('strapline')}</p>
            <p>Awarded on:<br />{moment(this.props.badge.get('issuedOn')).format("MMM MM, YYYY hh:mm")} </p>
            <div className = "btn btn-default" onClick={this.addToBackpack}>Add to backpack!</div>
            </div>
        );
      }

      return(
        <li onClick={this.handleClick} className='badge-li'>
          <img className='image' src={badge.get('imageUrl')} />
          <h4 className='badge-name'>{badge.get('name')}</h4>
          {content}
        </li>
      );
    }


  });

});
