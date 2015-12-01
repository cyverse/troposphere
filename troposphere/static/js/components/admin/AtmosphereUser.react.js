define(function (require) {
  "use strict";

  var React = require('react/addons'),
    Backbone = require('backbone'),
    moment = require('moment'),
    Router = require('react-router'),
    actions = require('actions'),
    ToggleButton = require('components/common/ToggleButton.react'),
    stores = require('stores');

  return React.createClass({
    displayName: "AtmosphereUser",

    propTypes: {
      user: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    toggleStaffStatus: function(new_status, e){
        // Call to action -- update end_date to 'now' or 'null'
        actions.UserActions.update(this.props.user, {'is_staff':new_status});
    },

    toggleSuperuserStatus: function(new_status, e){
        // Call to action -- update end_date to 'now' or 'null'
        actions.UserActions.update(this.props.user, {'is_superuser':new_status});
    },

    toggleDisableUser: function(){
        // Call to action -- update end_date to 'now' or 'null'
        var now_time = moment(Date.now()),
            is_disabled = this.props.user.get('end_date'), //disabled if end_date exists
            new_end_date = is_disabled ? null : now_time, //Toggle/flip based on existing value in 'props.user'
            is_active = is_disabled; //if is_disabled=True, new is_active=True, if is_disabled=False, new is_active=False
        actions.UserActions.update(this.props.user, {'end_date':new_end_date, 'is_active':is_active});
    },

    render: function () {
      var user = this.props.user;
      var userStatus =  user.get('end_date');
      var email_str =  user.get('email');
      var btnStatus = userStatus ? "primary" : "danger";
      var btnClass = "btn btn-" + btnStatus + " btn-xs pull-right";
      var statusDisc = {
            display:"inline-block",
            marginRight:"10px",
            background: userStatus ? "red" : "green",
            borderRadius: "100px",
            height:"10px",
            width:"10px"
        };
      if(! email_str ) {
          email_str = "No E-mail listed";
      }
      return (
        <tr>
          <td className="user-name">{user.get('username')}</td>
          <td className="email">{email_str}</td>
          <td className="is-superuser">
            <ToggleButton
              isEnabled={user.get('is_superuser')}
              onToggle={this.toggleSuperuserStatus}
            />
          </td>
          <td className="is-staff">
            <ToggleButton
              isEnabled={user.get('is_staff')}
              onToggle={this.toggleStaffStatus}
            />
          </td>
          <td className="end-date">
          <span style={statusDisc}></span>
            {userStatus ? "Disabled as of "+user.get('end_date') : "Enabled"} 
            <button 
                type="button" 
                className={btnClass} 
                style={{marginLeft: "10px"}} 
                onClick={this.toggleDisableUser} >
                {userStatus ? "Enable" : "Disable"}
            </button>
          </td>
        </tr>
      );
    }


  });

});
