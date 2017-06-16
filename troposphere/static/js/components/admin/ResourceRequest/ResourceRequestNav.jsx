import React from "react";
import Backbone from "backbone";

export default React.createClass({
    propTypes: {
        selectedRequest: React.PropTypes.object,
        requests: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onSelect: React.PropTypes.func.isRequired
    },

    onResourceClick(request) {
        this.props.onSelect(request);
    },

    renderListItem(request) {
        let { selectedRequest } = this.props;
        let { listItem } = this.style();

        // Note: In the case that there is no selectedRequest, display a regular list item
        if (selectedRequest && selectedRequest.id == request.id) {
            listItem.backgroundColor = "#DDD";
        }

        return (
        <li style={listItem} key={request.id} onClick={() => this.onResourceClick(request)}>
            {request.get("created_by").username}
        </li>
        );
    },

    style() {
        return {
            list: {
                height: "500px",
                minWidth: "150px",
                overflowY: "scroll",
                overflowX: "hidden",
                padding: "0px"
            },
            listItem: {
                cursor: "pointer",
                padding:"5px",
                borderBottom: "1px solid lightgrey"
            }
        }
    },

    render() {
        let { list } = this.style();
        let { requests } = this.props;

        return (
        <ul style={list}>
            { requests.map(this.renderListItem) }
        </ul>
        );
    }
});
