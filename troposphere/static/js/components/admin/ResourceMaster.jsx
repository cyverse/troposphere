import React from "react";
import { withRouter } from "react-router";

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
        stores.AdminResourceRequestStore.removeChangeListener(this.requestListener);
    },

    componentDidMount() {
        stores.AdminResourceRequestStore.addChangeListener(this.requestListener);
        stores.AdminResourceRequestStore.getAll();
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
        this.props.router.push(`/admin/resource-requests/${request.id}`);
    },

    onRefresh() {
        this.setState({
            refreshing: true
        });

        stores.AdminResourceRequestStore.clearCache();
        stores.AdminResourceRequestStore.getAll();
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

    renderRequestDetail(selectedRequest) {
        let children = this.props.children;

        // If we don't have children then the user is at
        // `/application/admin/resource-requests`
        if (!children) {
            return <p style={{ margin: "1em" }}>Please select a request.</p>;
        }

        if (!selectedRequest) {
            return <div className="loading" />;
        }

        // Pass props to the child route
        return React.Children.map(children,
                c => React.cloneElement(c, { selectedRequest }));
    },

    renderBody() {
        let { container } = this.style();
        let params = this.props.params;
        let requestId = params.id;
        let requests = stores.AdminResourceRequestStore.getAll();

        if (!requests) {
            return <div className="loading" />;
        }

        if (requests.length == 0) {
            return <p>There are no requests.</p>;
        }

        // Lookup selectedRequest by requestId, or make a separate request for
        // the model specifically
        let selectedRequest =
            (requests.get(requestId) || stores.AdminResourceRequestStore.getModel(requestId));

        return (
        <div style={container}>
            { this.renderRequestNav(requests, selectedRequest) }
            { this.renderRequestDetail(selectedRequest) }
        </div>
        );
    },

    render() {
        return (
        <div className="resource-master">
            <h2 className="t-headline">Resource Requests {this.renderRefreshButton()}</h2>
            <hr />
            { this.renderBody() }
        </div>
        );
    }
});

export default withRouter(ResourceMaster);
