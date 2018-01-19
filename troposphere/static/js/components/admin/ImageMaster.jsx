import React from "react";
import { withRouter } from "react-router";

import subscribe from "utilities/subscribe";


const ImageMaster = React.createClass({

    propTypes: {
        params: React.PropTypes.object,
        subscriptions: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            refreshing: false,
            requests: null
        }
    },

    componentDidMount: function() {
        let { ImageRequestStore } = this.props.subscriptions;
        ImageRequestStore.fetchFirstPageWhere(
            {
                "active": "true"
            },
            {},
            function() {
                this.setState({
                    requests: ImageRequestStore.getAll()
                });
            }.bind(this));
    },

    onRefresh: function() {
        let { ImageRequestStore } = this.props.subscriptions;
        this.setState({
            refreshing: true
        });
        ImageRequestStore.fetchFirstPageWhere({
            "active": "true"
        },
            {},
            function() {
                this.setState({
                    refreshing: false,
                    requests: ImageRequestStore.getAll()
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

    renderRequestView() {
        let { params } = this.props;
        let { requests } = this.state;
        if (!("id" in params)) {
            return (
                <p>Please select a request.</p>
            );
        }

        let request = requests.find(r => r.get('id') == params.id)
        if (!request) {
            return (
                <p>This request is no longer active. Please select a request.</p>
            );
        }

        return  this.props.children;
    },

    render: function() {
        let { requests } = this.state;
        if (requests == null) {
            return <div className="loading"></div>
        }

        var imageRequestRows = requests.map(function(request) {
            var handleClick = function() {
                this.onResourceClick(request);
            }.bind(this);

            var errorStatus,
                statusName = request.get("status") ?
                             request.get("status").name : "(unknown)",
                newMachineOwner = request.get("new_machine_owner"),
                ownerUsername = newMachineOwner ?
                                newMachineOwner.username : "(unknown)";

            if (request.get("old_status").indexOf("ERROR") > -1
                || request.get("old_status").indexOf("Traceback") > -1
                || request.get("old_status").indexOf("Exception") > -1) {
                errorStatus = "(ERROR)";
            }

            return (
            <li key={request.id} onClick={handleClick}>
                {ownerUsername} - <strong>{statusName}{errorStatus}</strong>
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
            { this.renderRequestView() }
        </div>
        );
    }
});

export default withRouter(subscribe(ImageMaster, ["ImageRequestStore"]));
