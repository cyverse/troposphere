import React from "react";
import Backbone from "backbone";

import modals from "modals";
import TagMultiSelect from "components/common/tags/TagMultiSelect";

export default React.createClass({
    displayName: "EditTagsView",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        imageTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onTagAdded: React.PropTypes.func.isRequired,
        onTagRemoved: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            tags: this.props.image.get("tags"),
            query: ""
        }
    },

    onEnterKeyPressed: function(e) {
        e.preventDefault();
        let text = e.target.value.trim();
        if (e.which == 13 /*Enter key*/) {
            this.onCreateNewTag(text);
        }
    },

    onCreateNewEmptyTag: function(e) {
        e.preventDefault();
        this.onCreateNewTag("");
    },

    onQueryChange: function(query) {
        this.setState({
            query,
        });
    },

    onCreateNewTag: function(tagNameSuggestion) {
        modals.TagModals.create(tagNameSuggestion);
    },

    render: function() {
        let { imageTags, tags } = this.props;
        let query = this.state.query;

        if (query && tags) {
            tags = tags.cfilter(function(tag) {
                return tag.get("name").toLowerCase().indexOf(query.toLowerCase()) >= 0;
            });
        }

        return (
        <div className="image-tags">
            <h4 className="t-body-2">Tags</h4>
            <div className="content">
                <div className="resource-tags">
                    <TagMultiSelect
                        models={tags}
                        activeModels={imageTags}
                        onModelAdded={this.props.onTagAdded}
                        onModelRemoved={this.props.onTagRemoved}
                        onCreateNewTag={this.onCreateNewTag}
                        onEnterKeyPressed={this.onEnterKeyPressed}
                        onQueryChange={this.onQueryChange}
                        placeholderText="Search by tag name..." />
                    <a className="btn btn-primary new-tag"
                        href="#"
                        onClick={this.onCreateNewEmptyTag}>
                        + Create New tag
                    </a>
                </div>
            </div>
        </div>
        );
    }
});
