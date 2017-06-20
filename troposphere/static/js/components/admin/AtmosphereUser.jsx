import React from "react";
import Backbone from "backbone";
import moment from "moment";
import actions from "actions";
import ToggleButton from "components/common/ToggleButton";
import Emulate from "./Emulate";


export default React.createClass({
    displayName: "AtmosphereUser",

    propTypes: {
        user: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    toggleStaffStatus: function(new_status, e) {
        // Call to action -- update end_date to 'now' or 'null'
        actions.UserActions.update(this.props.user, {
            "is_staff": new_status
        });
    },

    toggleSuperuserStatus: function(new_status, e) {
        // Call to action -- update end_date to 'now' or 'null'
        actions.UserActions.update(this.props.user, {
            "is_superuser": new_status
        });
    },

    toggleDisableUser: function() {
        // Call to action -- update end_date to 'now' or 'null'
        var now_time = moment(Date.now()),
            is_disabled = this.props.user.get("end_date"), //disabled if end_date exists
            new_end_date = is_disabled ? null : now_time, //Toggle/flip based on existing value in 'props.user'
            is_active = is_disabled; //if is_disabled=True, new is_active=True, if is_disabled=False, new is_active=False
        actions.UserActions.update(this.props.user, {
            "end_date": new_end_date,
            "is_active": is_active
        });
    },

    render: function() {
        let user = this.props.user;
        let userStatus = user.get("end_date");
        let email_str = user.get("email");
        let btnStatus = userStatus ? "primary" : "danger";
        let btnClass = "btn btn-" + btnStatus + " btn-xs pull-right";
        let statusDisc = {
            display: "inline-block",
            marginRight: "10px",
            background: userStatus ? "red" : "green",
            borderRadius: "100px",
            height: "10px",
            width: "10px"
        };
        if (!email_str) {
            email_str = "No E-mail listed";
        }
        return (
        <tr className="card">
            <td style={{ border: "none" }} 
                className="user-name"
            >
                 <Emulate username={user.get("username")} /> {user.get("username")}
            </td>
            <td style={{ border: "none" }}
                className="email"
            >
                {email_str}
            </td>
            <td style={{ border: "none" }}
                className="is-superuser"
            >
                <ToggleButton 
                    isEnabled={user.get("is_superuser")} 
                    onToggle={this.toggleSuperuserStatus}
                />
            </td>
            <td style={{ border: "none" }}
                className="is-staff"
            >
                <ToggleButton 
                    isEnabled={user.get("is_staff")}
                    onToggle={this.toggleStaffStatus}
                />
            </td>
            <td style={{ border: "none" }} className="end-date">
                <span style={statusDisc} />
                { 
                    userStatus 
                        ? "Disabled as of " + user.get("end_date") 
                        : "Enabled"
                }
                <button type="button"
                    className={btnClass}
                    style={{ marginLeft: "10px" }}
                    onClick={this.toggleDisableUser}
                >
                    { userStatus ? "Enable" : "Disable" }
                </button>
            </td>
        </tr>
        );
    }
});
