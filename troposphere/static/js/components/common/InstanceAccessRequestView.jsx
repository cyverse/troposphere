import React from "react";
import Backbone from "backbone";
import subscribe from 'utilities/subscribe';
import Glyphicon from "components/common/Glyphicon";
import ChosenSingleDropdown from "components/common/ui/ChosenSingleDropdown";

/**
 * WIP:
 * - User is 'selected' in the chosen, but the query is not updated
 */
const InstanceAccessRequestView = React.createClass({
    displayName: "InstanceAccessRequestView",


    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onSelectUser: React.PropTypes.func
    },
    getInitialState: function() {
        return {
            username: "",
        }
    },
    onSelectUser: function(user) {
        var username = user.get('username');

        this.setState({
            username: username,
        });
        if(this.props.onSelectUser) {
            this.props.onSelectUser(user);
        }
    },
    //
    // Render
    // ------
    //
    renderRequest: function() {
        let { UserStore } = this.props.subscriptions,
            options = UserStore.getAllPages(),
            instance_ip = this.props.instance.get('ip_address'),
            current = UserStore.getUsername(this.state.username);
        if(options == null) {
            return (<div className="loading" />);
        }
        return (
        <div>
            <h3>Create an Instance Access Request</h3>
            <div>
              <p>
                {"Here we will describe the instance access request process like a human. "} <br/><br/>
                {"Requirements include:"}<br/>
                {"- Instance access will allow the shared user to login via password (if available) and SSH key access, to the instance: "+instance_ip}<br/>
                {"- Multiple instance access request(s) can be created, but users must be invited one at a time."}<br/>
                {"- The shared user will be notified in the application when you send an instance access request."}<br/>
                {"- The shared user must accept your instance access request before they will gain access."}<br/>
                {"- The shared user can deny your instance access request.."}<br/>
                {"- At any point after the access request is approved, you can delete the request and the users login/SSH access will also be removed from the application."}<br/>
                </p>
            </div>
            <div className="form-group">
                <label htmlFor="instanceRequest" className="col-sm-3 control-label">
                    {"Username to Share Instance With"}
                </label>
                <div className="col-sm-9">
                <ChosenSingleDropdown current={current}
                    className="form-control"
                    searchField={"username"}
                    models={options}
                    onModelSelected={this.onSelectUser}
                />
                </div>
            </div>
        </div>);
    },
    render: function() {
        return (
        <div>
            <p className="alert alert-warning">
                <Glyphicon name="info-sign" />
                {" "}
                <strong>Sharing Instance Access</strong>
                {" Sharing an instance will create users with root access to the VM. Do not share with people you do not trust."}
            </p>
            {this.renderRequest()}
        </div>
        );
    },
});

export default subscribe( InstanceAccessRequestView, ["InstanceAccessStore", "UserStore"]);
