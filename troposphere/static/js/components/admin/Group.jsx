import React from "react";
import Backbone from "backbone";
import modals from "modals";


export default React.createClass({
    displayName: "Group",

    propTypes: {
        group: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    toggleEditGroup: function() {
        // TODO: Modal to edit the group, add new users to it, etc.
        modals.GroupModals.edit({group: this.props.group});
    },

    render: function() {
        let group = this.props.group;
        let name = group.get('name');
        let users = group.get('users').map(u => u.username);
        let leaders = group.get("leaders").map(u => u.username);
        let btnClass = "btn btn-primary btn-xs pull-right";
        return (
        <tr className="card">
            <td style={{ border: "none" }} 
                className="group-name-cell"
            >
                {name}
            </td>
            <td style={{ border: "none" }}
                className="group-users-cell"
            >
                {users.join(", ")}
            </td>
            <td style={{ border: "none" }}
                className="group-leaders-cell"
            >
                {leaders.join(", ")}
            </td>
            <td style={{ border: "none" }} className="group-edit-cell">
                <button type="button"
                    className={btnClass}
                    style={{ marginLeft: "10px" }}
                    onClick={this.toggleEditGroup}
                >
                    { "Edit Group" }
                </button>
            </td>
        </tr>
        );
    }
});
