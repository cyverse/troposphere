import React from "react";

import ResourceActions from "actions/ResourceActions";
import subscribe from "utilities/subscribe";
import RaisedButton from "material-ui/RaisedButton";


const MyResourceRequestsPage = React.createClass({
    displayName: "MyResourceRequestsPage",

    props: {
        subscriptions: React.PropTypes.object.isRequired
    },

    closeRequest: function(request) {
        let { StatusStore } = this.props.subscriptions;
        var closedStatus = StatusStore.findWhere({
            "name": "closed"
        }).models[0].id;
        ResourceActions.close({
            request: request,
            status: closedStatus
        });
    },

    render: function() {
        let { ProfileStore, StatusStore, ResourceRequestStore } = this.props.subscriptions;
        var username = ProfileStore.get().id,
            statusTypes = StatusStore.getAll();

        if (username == null || !statusTypes) {
            return <div className="loading"></div>
        }

        var requests = ResourceRequestStore.findWhere({
            "created_by.username": username
        });


        if (requests == null) {
            return <div className="loading"></div>;
        }

        if (!requests.models[0]) {
            return (
            <div className="container">
                <p>
                    You have not made any resource requests.
                </p>
            </div>
            );
        }

        var displayRequests = requests.map(function(request) {

            // Handler to allow close buton to call React class closeRequest with the proper argument
            var close = function() {
                this.closeRequest(request)
            }.bind(this);

            var closeButton;
            var text = request.get("status").name;

            // set the color of the row based on the status of the request
            var trClass = "active";

            if (text === "approved") {
                trClass = "success";
            } else if (text === "denied") {
                trClass = "denied";
            } else if (text === "pending") {
                closeButton = (
                    <RaisedButton
                        primary
                        className="pull-right"
                        onTouchTap={close}
                        label="Close"
                    />
                );
            }

            return (
            <tr key={request.id} className={trClass}>
                <td className="col-md-5">
                    {request.get("request")}
                </td>
                <td className="col-md-5">
                    {request.get("description")}
                </td>
                <td className="col-md-2">
                    {request.get("status").name}
                    {closeButton}
                </td>
            </tr>
            );

        }.bind(this));

        return (
        <div className="container">
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
                    {displayRequests}
                </tbody>
            </table>
        </div>
        );
    }
});

export default subscribe(MyResourceRequestsPage, ["ProfileStore", "StatusStore", "ResourceRequestStore"]);
