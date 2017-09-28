import React from "react";
import Backbone from "backbone";
import RaisedButton from "material-ui/RaisedButton";
import EditTagsView from "./tags/EditTagsView";
import EditAccessView from "./access_list/EditAccessView";
import EditNameView from "./name/EditNameView";
import EditDescriptionView from "./description/EditDescriptionView";
import EditVisibilityView from "./visibility/EditVisibilityView";
import InteractiveDateField from "components/common/InteractiveDateField";
import globals from "globals";
import stores from "stores";
import actions from "actions";

export default React.createClass({
    displayName: "EditImageDetails",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        allPatterns: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        var image = this.props.image,
            endDate = image.get("end_date").isValid() ?
                image.get("end_date").tz(globals.TZ_REGION).format("M/DD/YYYY hh:mm a z") : "";

        var imageTags = stores.TagStore.getImageTags(image);
        var imageAccessList = stores.PatternMatchStore.getImageAccess(image);
        return {
            name: image.get("name"),
            description: image.get("description"),
            is_public: image.get("is_public"),
            accessList: imageAccessList,
            endDate: endDate,
            tags: imageTags
        }
    },

    handleSave: function() {
        var updatedAttributes = {
            name: this.state.name,
            description: this.state.description,
            is_public: this.state.is_public,
            end_date: this.state.endDate,
            access_list: this.state.accessList,
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

    onVisibilityChange: function(visibility) {
        let is_public = visibility == "Public";
        this.setState({
            is_public,
        });
    },

    onAccessAdded: function(pattern_match) {
        let accessList = this.state.accessList
        accessList.add(pattern_match)
        this.setState({
            accessList: accessList
        });
    },
    onAccessRemoved: function(pattern_match) {
        let accessList = this.state.accessList
        accessList.remove(pattern_match)
        this.setState({
            accessList: accessList
        });
    },
    onPatternCreated: function(patternObj) {
        let params = {
            image: this.props.image,
            pattern: patternObj.pattern,
            type: (patternObj.type == "E-Mail") ? 'Email': 'Username',
            allowAccess: patternObj.allowAccess,
            onSuccess: this.onAccessAdded
        };
        actions.PatternMatchActions.create_AddToImage(params);

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
            allPatterns = this.props.allPatterns,
            accessList = this.state.accessList,
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
                            styleOverride={{lineHeight: "1.47"}}
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
                <EditVisibilityView
                    image={image}
                    value={this.state.is_public}
                    onChange={this.onVisibilityChange}
                />
                <EditAccessView
                    allPatterns={allPatterns}
                    activeAccessList={accessList}
                    onAccessAdded={this.onAccessAdded}
                    onAccessRemoved={this.onAccessRemoved}
                    onCreateNewPattern={this.onPatternCreated}
                />
                <EditTagsView
                    image={image}
                    tags={allTags}
                    imageTags={imageTags}
                    onTagAdded={this.onTagAdded}
                    onTagRemoved={this.onTagRemoved}
                />
            </div>
            <div className="edit-link-row clearfix">
                <hr/>
                <div style={{ float: "right" }}>
                    <RaisedButton
                        style={{ marginRight: "20px" }}
                        onTouchTap={this.props.onCancel}
                        label="Cancel"
                    />
                    <RaisedButton
                        primary
                        onTouchTap={this.handleSave}
                        label="Save"
                    />
                </div>
            </div>
        </div>
        );
    }
});
