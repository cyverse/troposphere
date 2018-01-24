import React from "react";
import Backbone from "backbone";

function sortByStatus(request) {
    if (request.get('status').name == "pending") {
        return 1;
    }
    return 2;
}

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
        let { listItem, listItemSelected, listItemProcessed  } = this.style();
        let username = request.get("created_by").username;
        let isProcessed = request.get('status').name != "pending";
        let isSelected = selectedRequest && selectedRequest.id == request.id;

        // Note: In the case that there is no selectedRequest, display a regular list item
        let itemStyle = {
            ...listItem,
            ...(isSelected ? listItemSelected : {}),
            ...(isProcessed ? listItemProcessed : {}),
        }

        return (
        <li style={itemStyle} key={request.id} onClick={() => this.onResourceClick(request)}>
            { username }
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
                borderBottom: "1px solid lightgrey",
            },
            listItemSelected: {
                backgroundColor: "#DDD",
            },
            listItemProcessed: {
                opacity: 0.4,
            }
        }
    },

    render() {
        let { list } = this.style();
        let { requests } = this.props;

        return (
        <ul style={list}>
            {
                // Requests are assumed to be sorted by start date, we then
                // further sort to render the pending requests first (sortBy
                // is stable)
                requests.sortBy(sortByStatus).map(this.renderListItem)
            }
        </ul>
        );
    }
});
