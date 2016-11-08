import React from "react";
import Backbone from "backbone";
import EditTagsView from "./tags/EditTagsView";
import EditNameView from "./name/EditNameView";
import EditDescriptionView from "./description/EditDescriptionView";
import InteractiveDateField from "components/common/InteractiveDateField";
import globals from "globals";
import stores from "stores";

export default React.createClass({
    displayName: "EditImageDetails",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        var image = this.props.image,
            endDate = image.get("end_date").isValid() ?
                image.get("end_date").tz(globals.TZ_REGION).format("M/DD/YYYY hh:mm a z") : "";

        var imageTags = stores.TagStore.getImageTags(image);
        return {
            name: image.get("name"),
            description: image.get("description"),
            endDate: endDate,
            tags: imageTags
        }
    },

    handleSave: function() {
        var updatedAttributes = {
            name: this.state.name,
            description: this.state.description,
            end_date: this.state.endDate,
            tags: this.state.tags
        };

        this.props.onSave(updatedAttributes);
    },

    handleEndDateChange: function(value) {
        var endDate = value;
        this.setState({
            endDate: endDate
        });
    },

    handleNameChange: function(e) {
        var name = e.target.value;
        this.setState({
            name: name
        });
    },

    handleDescriptionChange: function(e) {
        var description = e.target.value;
        this.setState({
            description: description
        });
    },

    onTagAdded: function(tag) {
        let tags = this.state.tags
        tags.add(tag)
        this.setState({
            tags: tags
        });
    },

    onTagRemoved: function(tag) {
        let tags = this.state.tags
        tags.remove(tag)
        this.setState({
            tags: tags
        });
    },

    render: function() {
        var image = this.props.image,
            allTags = this.props.tags,
            imageTags = this.state.tags;

        return (
        <div className="card" style={{ maxWidth: "600px" }} >
            <div style={{ marginBottom: "20px" }} >
                <EditNameView 
                    image={image} 
                    value={this.state.name} 
                    onChange={this.handleNameChange} 
                />
                <div>
                    <h4 className="t-body-2">
                        Date to hide image from public view
                    </h4>
                    <div style={{ marginBottom: "15px" }} >
                        <InteractiveDateField 
                            value={this.state.endDate} 
                            onChange={this.handleEndDateChange} 
                        />
                    </div>
                </div>
                <EditDescriptionView 
                    titleClassName="title"
                    formClassName="form-group"
                    title="Description"
                    image={image}
                    value={this.state.description}
                    onChange={this.handleDescriptionChange} 
                />
                <EditTagsView 
                    image={image}
                    tags={allTags}
                    value={imageTags}
                    onTagAdded={this.onTagAdded}
                    onTagRemoved={this.onTagRemoved} 
                />
            </div>
            <div className="edit-link-row clearfix">
                <hr/>
                <a className="btn btn-primary pull-right" onClick={this.handleSave}>Save</a>
                <a className="btn btn-default pull-right" style={{ marginRight: "20px" }} onClick={this.props.onCancel}>Cancel</a>
            </div>
        </div>
        );
    }
});
