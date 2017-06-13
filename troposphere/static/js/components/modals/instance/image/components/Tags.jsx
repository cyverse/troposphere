import React from "react";
import Backbone from "backbone";
import stores from "stores";
import actions from "actions";
import TagMultiSelect from "components/common/tags/TagMultiSelect";
import TagCreateForm from "./TagCreateForm";


export default React.createClass({
    displayName: "Tags",

    propTypes: {
        onTagAdded: React.PropTypes.func.isRequired,
        onTagRemoved: React.PropTypes.func.isRequired,
        onTagCreated: React.PropTypes.func.isRequired,
        imageTags: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getInitialState: function() {
        return {
            tags: null,
            query: "",
            newTagName: "",
            newTagDescription: "",
            showTagCreateForm: false
        }
    },

    componentDidMount: function() {
        stores.TagStore.addChangeListener(this.updateState);
        this.updateState();
    },

    componentWillUnmount: function() {
        stores.TagStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        this.setState({
            tags: stores.TagStore.getAll(),
        });
    },

    createTagAndAddToImage: function() {
        var newTag = actions.TagActions.create({
            name: this.state.newTagName,
            description: this.state.newTagDescription
        });
        this.props.onTagAdded(newTag);
        this.setState({
            newTagName: "",
            newTagDescription: "",
            showTagCreateForm: false
        });
    },

    onQueryChange: function(query) {
        this.setState({
            query: query.toLowerCase()
        });
    },

    onNewTagNameChange: function(name) {
        this.setState({
            newTagName: name.target.value
        });
    },

    onNewTagDescriptionChange: function(description) {
        this.setState({
            newTagDescription: description.target.value
        });
    },

    isSubmittable: function() {
        return this.state.newTagName && this.state.newTagDescription;
    },

    onCreateNewTag: function(tagName) {
        this.setState({
            newTagName: tagName,
            showTagCreateForm: true
        });
    },

    allowAccessFilter(tag) {
        // The 'allow_access' field determines if a user can see/use the tag.
        // If the tag has not been persisted yet, but the user was allowed to
        // make it, we assume they can see/use it.
        return tag.isNew() || tag.get("allow_access");
    },

    renderTagSelect() {
        let imageTags = this.props.imageTags;
        let tags = this.state.tags;
        let query = this.state.query;
        let filteredImageTags = imageTags.cfilter(this.allowAccessFilter);
        let filteredTags = tags.cfilter(this.allowAccessFilter);

        // Further filter down by a query
        if (query) {
            filteredTags = filteredTags.cfilter(tag => {
                let name = tag.get("name").toLowerCase();
                return name.indexOf(query) >= 0;
            });
        }

        return (
            <TagMultiSelect
                models={filteredTags}
                activeModels={filteredImageTags}
                onCreateNewTag={this.onCreateNewTag}
                onModelAdded={this.props.onTagAdded}
                onModelRemoved={this.props.onTagRemoved}
                onModelCreated={this.props.onTagCreated}
                onQueryChange={this.onQueryChange}
                width={"100%"}
                placeholderText="Search by tag name..."
            />
        );
    },

    renderTagCreateForm() {
        return (
            <TagCreateForm
                isSubmittable={ this.isSubmittable }
                createTagAndAddToImage={ this.createTagAndAddToImage }
                newTagDescription={ this.state.newTagDescription }
                newTagName={ this.state.newTagName }
                onNewTagDescriptionChange={ this.onNewTagDescriptionChange }
                onNewTagName={ this.onNewTagName }
                onNewTagNameChange={ this.onNewTagNameChange }
            />
        );
    },

    render: function() {
        let imageTags = this.props.imageTags;
        let tags = this.state.tags;

        if (!(imageTags && tags))
            return <div className="loading" />;

        return (
        <div className="form-group" style={{ marginBottom: "30px" }}>
            <label htmlFor="tags" className="control-label">
                Image Tags
            </label>
            <div className="tagger_container">
                <div className="help-block">
                    Please include tags that will help users decide whether this image will suit their needs. You can include the operating system, installed software, or configuration
                    information. E.g. Ubuntu, NGS Viewers, MAKER, QIIME, etc.
                </div>
                <div className="help-block">
                    For your convenience, we've automatically added the tags that were already on the instance.
                </div>
                {this.renderTagSelect()}
                {this.state.showTagCreateForm
                 ? this.renderTagCreateForm()
                 : null}
            </div>
        </div>
        );
    }
})
