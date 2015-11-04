define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Backbone = require('backbone'),
    moment = require('moment'),
    Router = require('react-router'),
    showManageUserModal = require('modals/admin/showManageUserModal.js'),
    actions = require('actions'),
    stores = require('stores');

  return React.createClass({

    propTypes: {
      membership: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    toggleDisableUser: function(){
        //showManageUserModal.showModal(this.props.membership);
        // Call to action -- update end_date to 'now' or 'null'
        var now_time = moment(Date.now()),
            new_end_date = (this.props.membership.end_date) ? null : now_time;
        actions.IdentityMembershipActions.update(this.props.membership, {'end_date':new_end_date});
    },

    updateUser: function() {
        showManageUserModal.showModal(this.props.membership);
    },

    render: function () {
      var membership = this.props.membership;
      var membershipStatus =  membership.get('end_date');
      var provider_str =  membership.get('provider').name;
      var btnStatus = membershipStatus ? "primary" : "danger";
      var btnClass = "btn btn-" + btnStatus + " btn-xs pull-right";
      var statusDisc = {
            display:"inline-block",
            marginRight:"10px",
            background: membershipStatus ? "red" : "green",
            borderRadius: "100px",
            height:"10px",
            width:"10px"
        };
      if(membership.get('provider').active == false) {
          provider_str = provider_str + " - Inactive"
      } else if(membership.get('provider').end_date) {
          provider_str = provider_str + " - Inactive as of " + membership.get('provider').end_date;
      }
      return (
        <tr>
          <td className="user-name">{membership.get('user').username}</td>
          <td className="provider">{provider_str}</td>
          <td className="end-date">
          <span style={statusDisc}></span>
            {membershipStatus ? "Disabled as of "+membership.get('end_date') : "Enabled"} 
            <button 
                type="button" 
                className={btnClass} 
                style={{marginLeft: "10px"}} 
                onClick={this.toggleDisableUser} >
                {membershipStatus ? "Enable" : "Disable"}
            </button>
          </td>
        </tr>
      );
    }


  });

});
