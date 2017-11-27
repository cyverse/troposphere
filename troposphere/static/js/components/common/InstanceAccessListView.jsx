import React from "react";
import Backbone from "backbone";
import subscribe from 'utilities/subscribe';
import Glyphicon from "components/common/Glyphicon";
import context from "context";
import featureFlags from "utilities/featureFlags";

import actions from "actions";
/**
 * WIP:
 * - User is 'selected' in the chosen, but the query is not updated
 */
const InstanceAccessListView = React.createClass({
    displayName: "InstanceAccessListView",


    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model),
    },
    getInitialState: function() {
        return {
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
    updateRequestsList: function() {
        let {InstanceAccessStore} = this.props.subscriptions;

        InstanceAccessStore.clearCache();
    },
    getRequests: function() {
        let {InstanceAccessStore} = this.props.subscriptions,
            current_username = context.profile.get('username'),
            access_requests;

        if(this.props.instance) {
            access_requests = InstanceAccessStore.getForInstance(this.props.instance);
        } else {
            access_requests = InstanceAccessStore.getAll();
        }
        if(access_requests) {
            access_requests = access_requests.cfilter(access_request => {
                if(access_request.get('status') == 'denied' && access_request.get('instance').user != current_username) {
                    return false;
                }
                return true;
            });
        }
        return access_requests;
    },
    renderHeaderRow: function() {
        return (
            <tr>
                <th style={{ width: "300px" }}>Instance</th>
                <th style={{width: "150px" }}>User</th>
                <th style={{ width: "75px" }}>Status</th>
                <th style={{textAlign: "right" }}>Actions</th>
            </tr>
        );
    },
    approveRequest: function(accessRequest) {
        actions.InstanceActions.updateShareRequest({
            instance_access_request: accessRequest,
            status: "approved",
            onSuccess: this.updateRequestsList
        });
    },
    deleteRequest: function(accessRequest) {
        actions.InstanceActions.deleteShareRequest({
            instance_access_request: accessRequest,
            onSuccess: this.updateRequestsList
        });
        //TODO: On delete, update the table to remove the result.
    },

    renderAccessRequestActions: function(accessRequest) {
        let tdStyle = {
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            textAlign: 'right',
        };
        let requestUser = accessRequest.get('user').username,
            key = accessRequest.id + "-",
            approve_text = "Approve request",
            delete_text = "Delete instance access for "+ requestUser,
            approve_action = (<a key={key + "approve"} title={approve_text} onClick={this.approveRequest.bind(this, accessRequest)}>
                   <Glyphicon name="ok" />
               </a>),
            delete_action = (<a key={key + "delete"} title={delete_text} style={{color: "crimson"}} onClick={this.deleteRequest.bind(this, accessRequest)}>
                   <Glyphicon name="trash" />
               </a>);
        let actions = []
        if(featureFlags.autoApproveInstanceAccess() == false) {
            actions.push(approve_action);
        }
        actions.push(delete_action)
        return (
           <td key={key} style={tdStyle}>
            {actions}
           </td>
        );
    },
    renderAccessRequestRow: function(accessRequest) {
        let instance = accessRequest.get('instance'),
            requestUser = accessRequest.get('user').username,
            status = accessRequest.get('status'),
            tdStyle = {
                wordWrap: 'break-word',
                whiteSpace: 'normal'
            },
            key = accessRequest.id;

        return (
            <tr key={key}>
                <td style={tdStyle}>
                    {instance.uuid}
                </td>
                <td style={tdStyle}>
                    {requestUser}
                </td>
                <td style={tdStyle}>
                    {status}
                </td>
                {this.renderAccessRequestActions(accessRequest)}
            </tr>
        );
    },
    render: function() {
        let access_requests = this.getRequests();

        if(access_requests == null) {
            return null;
        }

        return (
        <div>
            <h3>Instance Access Requests</h3>
            <div style={{maxWidth: "600px"}}>
                <p>
                    This table contains a list of access requests.
                    You can delete an access request by
                    clicking on the corresponding action on the right-hand side of each row.
                </p>
            </div>
            <div style={{maxWidth: "80%"}}>
                <table className="clearfix table" style={{ tableLayout: "fixed" }}>
                    <thead>
                        {this.renderHeaderRow()}
                    </thead>
                    <tbody>
                        { access_requests.map(this.renderAccessRequestRow) }
                    </tbody>
                </table>
            </div>
        </div>
        );
    },
});

export default subscribe(InstanceAccessListView, ["InstanceAccessStore", "UserStore"]);
