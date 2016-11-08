import React from "react";
import stores from "stores";
import Router from "react-router";

export default React.createClass({
    displayName: "ImageTagsPage",

    getState() {
        return {
            images: stores.ImageStore.getAll(),
            tags: stores.TagStore.getAll()
        };
    },

    getInitialState() {
        var state = this.getState();
        state.searchTerm = "";
        return state;
    },

    updateState() {
        if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount() {
        stores.ImageStore.addChangeListener(this.updateState);
        stores.TagStore.addChangeListener(this.updateState);
    },

    componentWillUnmount() {
        stores.ImageStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
    },

    handleFilterChange(e) {
        var searchTerm = e.target.value;
        this.setState({
            searchTerm: searchTerm
        });
    },

    renderTagRow(tag) {
        var name = tag.get("name"),
            description = tag.get("description");

        return (
        <tr key={tag.id || tag.cid}
            className="card"
        >
            <td style={{ paddingRight: "20px", border: "none" }}>
                <h4 
                    className="t-body-2" 
                    style={{ "margin": "0", "color": "#5A5A5A" }}
                >
                    <Router.Link to="search" query={{ q: name }}>
                        {name}
                    </Router.Link></h4>
            </td>
            <td style={{ border: "none" }}>
                <span style={{ maxWidth: "550px", display: "block" }}>
                    {description}
                </span>
            </td>
        </tr>
        )
    },

    getFilteredTags(tags, searchTerm) {
        var filteredTags = tags;
        searchTerm = searchTerm.trim().toLowerCase();

        if (searchTerm) {
            filteredTags = tags.filter(function(tag) {
                var name = tag.get("name").toLowerCase(),
                    description = tag.get("description").toLowerCase();

                return name.indexOf(searchTerm) >= 0 || description.indexOf(searchTerm) >= 0;
            });

            filteredTags = new tags.constructor(filteredTags);
        }

        return filteredTags;
    },

    renderTagsAsTable(tags) {
        if (tags) {
            return (
            <table className="table">
                <tbody>
                    {tags.map(this.renderTagRow)}
                </tbody>
            </table>
            )
        }

        return (
        <div className="loading"></div>
        )
    },

    render() {
        var tags = this.state.tags,
            searchTerm = this.state.searchTerm,
            text = "";

        if (tags) {
            tags = this.getFilteredTags(tags, searchTerm);
        }

        if (tags && this.state.searchTerm) {
            if (tags.length > 0) {
                text = 'Showing tags matching "' + searchTerm + '"';
            } else {
                text = 'No tags matching "' + searchTerm + '"';
            }
        } else {
            text = "Showing all tags"
        }

        return (
        <div className="container">
            <h1 className="t-display-1">
                Image Tags
            </h1>
            <div 
                id="search-container" 
                style={{ marginBottom: "30px" }}
            >
                <input 
                    type="text"
                    className="form-control search-input"
                    placeholder="Filter by tag name or description"
                    value={this.state.searchTerm}
                    onChange={this.handleFilterChange} 
                />
                <h3 className="t-body-2" >
                    { text }
                </h3>
            </div>
            <div className="image-tag-list">
                { this.renderTagsAsTable(tags) }
            </div>
        </div>
        );
    }
});
