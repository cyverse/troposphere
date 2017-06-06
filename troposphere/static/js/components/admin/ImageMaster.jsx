import React from "react";
import { withRouter } from "react-router";

import stores from "stores";


const ImageMaster = React.createClass({

    getInitialState: function() {
        return {
            refreshing: false,
            requests: null
        }
    },

    componentDidMount: function() {
        stores.StatusStore.getAll();
        stores.ImageRequestStore.fetchFirstPageWhere(
            {
                "active": "true"
            },
            {},
            function() {
                this.setState({
                    requests: stores.ImageRequestStore.getAll()
                });
            }.bind(this));
    },

    onRefresh: function() {
        this.setState({
            refreshing: true
        });
        stores.ImageRequestStore.fetchFirstPageWhere({
            "active": "true"
        },
            {},
            function() {
                this.setState({
                    refreshing: false,
                    requests: stores.ImageRequestStore.getAll()
                });
            }.bind(this));
    },

    onResourceClick: function(request) {
        let requestId = request.id;

        this.props.router.push(`admin/imaging-requests/${requestId}`);
    },

    renderRefreshButton: function() {
        var controlsClass = "glyphicon pull-right glyphicon-refresh" + (this.state.refreshing ? " refreshing" : "");

        return (
        <span className={controlsClass} onClick={this.onRefresh} />
        );
    },

    render: function() {
        var requests = this.state.requests;
        if (requests == null) {
            return <div className="loading"></div>
        }

        var imageRequestRows = requests.map(function(request) {
            var handleClick = function() {
                this.onResourceClick(request);
            }.bind(this);

            var errorStatus;

            if (request.get("old_status").indexOf("ERROR") > -1
                || request.get("old_status").indexOf("Traceback") > -1
                || request.get("old_status").indexOf("Exception") > -1) {
                errorStatus = "(ERROR)";
            }

            return (
            <li key={request.id} onClick={handleClick}>
                {request.get("new_machine_owner").username} - <strong>{request.get("status").name}{errorStatus}</strong>
            </li>
            );
        }.bind(this));

        if (!imageRequestRows[0]) {
            return (
            <div>
                {this.renderRefreshButton()}
                <h3 className="t-body-2">No imaging requests</h3>
            </div>
            );
        }

        return (
        <div className="image-master">
            <h2 className="t-headline">Imaging Requests {this.renderRefreshButton()}</h2>
            <ul className="requests-list pull-left">
                {imageRequestRows}
            </ul>
            {this.props.children}
        </div>
        );
    }
});

export default withRouter(ImageMaster);
