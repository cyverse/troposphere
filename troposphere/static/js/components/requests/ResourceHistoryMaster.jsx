import React from "react";
import RaisedButton from "material-ui/RaisedButton";

import ResourceActions from "actions/ResourceActions";
import subscribe from "utilities/subscribe";


export default subscribe(React.createClass({
    displayName: "MyResourceRequestsPage",

    props: {
        subscriptions: React.PropTypes.object.isRequired
    },

    fetch() {
        let {
            ProfileStore, StatusStore, ResourceRequestStore
        } = this.props.subscriptions;

        let profile = ProfileStore.get();
        let statuses = StatusStore.getAll();

        let requests;
        if (profile) {
            requests = ResourceRequestStore.findWhere({
                "created_by.username": profile.get('username')
            });
        }

        return {
            statuses,
            requests,
            profile
        }
    },

    onClose(request, statuses) {
        let closedStatus = statuses.findWhere({ "name": "closed" });
        ResourceActions.close({
            request: request,
            status: closedStatus
        });
    },

    render() {
        let { statuses, requests, profile } = this.fetch();

        if (!(requests && statuses && profile)) {
            return <div className="loading" />
        }

        let viewProps = {
            statuses,
            requests,
            onClose: this.onClose
        };

        return <MyResourceRequestsPageView {...viewProps} />
    }

}), ["ProfileStore", "StatusStore", "ResourceRequestStore"]);

let MyResourceRequestsPageView = React.createClass({
    displayName: "MyResourceRequestsPageView",

    propTypes: {
        statuses: React.PropTypes.object.isRequired,
        requests: React.PropTypes.object.isRequired,
        onClose: React.PropTypes.func.isRequired
    },

    renderRequestRow(request) {
        let statuses = this.props.statuses;
        let statusName = request.get("status").name;

        let className = "active"
        if (statusName == "approved") {
            className = "success";
        } else if (statusName == "denied") {
            className = "denied";
        }

        let closeButton = (
        <RaisedButton primary
            className="pull-right"
            onTouchTap={() => this.props.onClose(request, statuses)}
            label="Close" />
        );

        return (
        <tr key={request.id} className={className}>
            <td className="col-md-5">
                {request.get("request")}
            </td>
            <td className="col-md-5">
                {request.get("description")}
            </td>
            <td className="col-md-2">
                {statusName}
                {statusName == "pending" ? closeButton : null}
            </td>
        </tr>
        );
    },

    renderBody() {
        let requests = this.props.requests;

        if (!requests.length) {
            return (
            <p>You have not made any resource requests.</p>
            );
        }

        return (
        <table className="table table-condensed image-requests">
            <tbody>
                <tr>
                    <th>
                        <h3 className="t-title">Request</h3>
                    </th>
                    <th>
                        <h3 className="t-title">Reason</h3>
                    </th>
                    <th>
                        <h3 className="t-title">Status</h3>
                    </th>
                </tr>
                { requests.map(this.renderRequestRow) }
            </tbody>
        </table>
        );
    },

    render() {
        return (
        <div className="container">
            { this.renderBody() }
        </div>
        );
    }
});
