import React from "react";
import Router, { RouteHandler } from "react-router";
import RouterInstance from "../../Router";
import stores from "stores";

export default React.createClass({

    mixins: [Router.State],

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
        // FIXME: might be an *eager-fetch*, or might not be needed at all
        stores.ResourceRequestStore.findWhere({
            "status.name": "pending"
        });
    },

    requestListener() {
        // This should be a get. But there is not a store method to match this
        // functionality.
        let requests = stores.ResourceRequestStore.findWhere({
            "status.name": "pending"
        });
        if (requests) {
            this.setState({
                requests
            });
        }
    },

    onRefresh() {
        this.setState({
            refreshing: true
        });

        stores.ResourceRequestStore.fetchFirstPage(function() {
            this.setState({
                refreshing: false
            });
        }.bind(this));
    },

    onResourceClick(request) {
        RouterInstance.getInstance().transitionTo("resource-request-detail", {
            id: request.id
        });
    },

    renderRefreshButton() {
        var controlsClass = "glyphicon pull-right glyphicon-refresh" + (this.state.refreshing ? " refreshing" : "");
        return (
        <span className={controlsClass} onClick={this.onRefresh} />
        );
    },

    renderResourceRequests() {
        var requests = stores.ResourceRequestStore.findWhere({
            "status.name": "pending"
        });

        // Loading requests
        if (!requests) {
            return <div className="loading"></div>;
        }

        if (
            // If the url is not pointing at a specific request
            /resource-requests\/?$/.test(window.location)

            // AND there are requests
            && requests.length > 0
        ) {

            // Navigate to a request at the top of the list
            RouterInstance.getInstance().transitionTo("resource-request-detail", {
                id: requests.at(0).id
            });
        }

        return requests.map((r) => {
            return (
            <li key={r.id} onClick={this.onResourceClick.bind(this, r)}>
                {r.get("created_by").username}
            </li>
            );
        })
    },

    render() {

        return (
        <div className="resource-master">
            <h2 className="t-headline">Resource Requests {this.renderRefreshButton()}</h2>
            <ul className="requests-list pull-left">
                {this.renderResourceRequests()}
            </ul>
            <RouteHandler />
        </div>
        );
    }
});
