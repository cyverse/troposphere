import React from "react";
import stores from "stores";
import ImageListView from "./list/ImageListView";

export default React.createClass({
    displayName: "ImageListPage",

    propTypes: {

        // This prop type is provided by react-router
        query: React.PropTypes.instanceOf(Object),
    },

    queryFromProps() {
        // The images route will be called with the following query
        //
        //     /application/images?q={tagname}
        //
        // We're just returning the string query from react-router
        return this.props.query.q || "";
    },

    render: function() {
        var tags = stores.TagStore.getAll(),
            helpLinks = stores.HelpLinkStore.getAll(),
            query = this.queryFromProps();

        if (!tags || !helpLinks) {
            return <div className="loading"></div>;
        }

        return (
        <ImageListView tags={tags} query={query} />
        );
    }
});
