import React from "react";
import stores from "stores";
import ImageListView from "./list/ImageListView";

export default React.createClass({
    displayName: "ImageListPage",

    propTypes: {
        location: React.PropTypes.object
    },

    getInitialState() {
        return {
            tags: null,
            helpLinks: null
        };
    },

    queryFromProps() {
        // TODO - rewrite this explanation to include child context
        // ... etc.
        //
        // The images route will be called with the following query
        //
        //     /application/images?q={tagname}
        //
        // We're just returning the string query from react-router
        let location = this.props.location,
            query = location.query;

        return query ? query.q : "";
    },

    updateState() {
        let tags = stores.TagStore.getAll(),
            helpLinks = stores.HelpLinkStore.getAll();

        this.setState({
            tags,
            helpLinks
        });
    },

    componentDidMount() {
        stores.TagStore.addChangeListener(this.updateState);
        stores.HelpLinkStore.addChangeListener(this.updateState);

        // Prime the data
        this.updateState();
    },

    componentWillUnmount() {
        stores.TagStore.removeChangeListener(this.updateState);
        stores.HelpLinkStore.removeChangeListener(this.updateState);
    },

    render: function() {
        let { tags, helpLinks } = this.state,
            query = this.queryFromProps();

        if (!tags || !helpLinks) {
            return <div className="loading"></div>;
        }

        return (
        <ImageListView tags={tags} query={query} />
        );
    }
});
