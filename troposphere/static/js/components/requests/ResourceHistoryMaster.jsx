import React from "react";
import ResourceActions from "actions/ResourceActions";
import stores from "stores";
import RaisedButton from "material-ui/RaisedButton";

export default React.createClass({
    displayName: "MyResourceRequestsPage",

    componentDidMount: function() {
        stores.StatusStore.addChangeListener(this.updateState);
        stores.ProfileStore.addChangeListener(this.updateState);
        stores.ResourceRequestStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.StatusStore.removeChangeListener(this.updateState);
        stores.ProfileStore.removeChangeListener(this.updateState);
        stores.ResourceRequestStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        this.forceUpdate();
    },

    closeRequest: function(request) {
        var closedStatus = stores.StatusStore.findWhere({
            "name": "closed"
        }).models[0].id;
        ResourceActions.close({
            request: request,
            status: closedStatus
        });
    },

    render: function() {
        var username = stores.ProfileStore.get().id,
            statusTypes = stores.StatusStore.getAll();

        if (username == null || !statusTypes) {
            return <div className="loading"></div>
        }

        var requests = stores.ResourceRequestStore.findWhere({
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
