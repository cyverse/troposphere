import React from "react";
import Backbone from "backbone";
import EditTagsView from "./ActualEditTagsView";
import modals from "modals";
import stores from "stores";


export default React.createClass({
    displayName: "EditTagsView",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onTagAdded: React.PropTypes.func.isRequired,
        onTagRemoved: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            tags: this.props.image.get("tags")
        }
    },

    onCreateNewTag: function(tagNameSuggestion) {
        modals.TagModals.create(tagNameSuggestion);
    },

    render: function() {
        var image = this.props.image;
        var image = new this.props.image.constructor({
            id: image.id,
            tags: this.props.value
        });
        var imageTags = stores.TagStore.getImageTags(image);

        return (
        <div className="image-tags">
            <h4 className="t-body-2">Tags</h4>
            <div className="content">
                <EditTagsView tags={this.props.tags}
                    activeTags={imageTags}
                    onTagAdded={this.props.onTagAdded}
                    onTagRemoved={this.props.onTagRemoved}
                    onCreateNewTag={this.onCreateNewTag} />
            </div>
        </div>
        );
    }
});
