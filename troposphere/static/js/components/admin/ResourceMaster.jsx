import React from "react";

import { browserHistory } from "react-router";
import ResourceRequestNav from "./ResourceRequest/ResourceRequestNav"
import stores from "stores";

const ResourceMaster = React.createClass({

    propTypes: {
        params: React.PropTypes.object.isRequired,
        children: React.PropTypes.object
    },

    getInitialState() {
        return {
            refreshing: false
        }
    },

    componentWillUnmount() {
        stores.ResourceRequestStore.removeChangeListener(this.requestListener);
    },

    componentDidMount() {
        stores.ResourceRequestStore.addChangeListener(this.requestListener);
        stores.ResourceRequestStore.findWhere({
            "status.name": "pending"
        });
    },

    requestListener() {
        this.setState({
            refreshing: false
        });
    },

    renderRefreshButton() {
        let { refreshing } = this.state;
        let { refreshIcon } = this.style();
        let controlsClass = "glyphicon glyphicon-refresh";

        if (refreshing) {
            controlsClass += " refreshing"
            refreshIcon.color = "inherit";
        }

        return (
        <span className={controlsClass} style={refreshIcon} onClick={this.onRefresh} />
        );
    },

    onSelect(request) {
        // Navigate to a request at the top of the list
        browserHistory.push(`/application/admin/resource-requests/${request.id}`);
    },

    onRefresh() {
        this.setState({
            refreshing: true
        });

        stores.ResourceRequestStore.clearCache();
        stores.ResourceRequestStore.getAll();
    },

    style() {
        return {
            refreshIcon: {
                float: "right",
                color: "lightgrey"
            },
            container: {
                display: "flex"
            }
        }
    },

    renderRequestNav(requests, selectedRequest) {
        let navProps = {
            selectedRequest,
            requests,
            onSelect: this.onSelect
        };

        return (
            <ResourceRequestNav {...navProps} />
        );
    },

    renderRequestDetail(requests, selectedRequest) {
        let children = this.props.children;

        // If we don't have children then the user is at
        // `/application/admin/resource-requests`
        if (!children) {
            return <p style={{ margin: "1em" }}>Please select a request.</p>;
        }

        // Pass props to the child route
        return React.Children.map(children,
                c => React.cloneElement(c, { requests, selectedRequest }));
    },

    renderBody(requests) {
        let { container } = this.style();
        let params = this.props.params;
        let requestId = params.id;

        // No requests
        if (requests.length == 0) {
            return <p>There are no requests.</p>;
        }

        // Request doesn't exist
        if (requestId && !requests.has(requestId)) {
            return <p>The request does not exist.</p>;
        }

        // Choose a selected request
        let selectedRequest = null;
        if (requestId) {
            selectedRequest = requests.get(params.id);
        }

        return (
        <div style={container}>
            { this.renderRequestNav(requests, selectedRequest) }
            { this.renderRequestDetail(requests, selectedRequest) }
        </div>
        );
    },

    render() {
        let requests = stores.ResourceRequestStore.findWhere({
            "status.name": "pending"
        });

        let body = null;
        if (!requests) {
            body = <div className="loading" />;
        } else {
            body = this.renderBody(requests);
        }

        return (
        <div className="resource-master">
            <h2 className="t-headline">Resource Requests {this.renderRefreshButton()}</h2>
            <hr />
            { body }
        </div>
        );
    }
});

export default ResourceMaster;
