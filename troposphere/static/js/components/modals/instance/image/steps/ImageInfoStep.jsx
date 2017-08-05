import $ from "jquery";
import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import Backbone from "backbone";

import Name from "../components/Name";
import CreateUpdateFlag from "../components/CreateUpdateFlag";
import Description from "../components/Description";
import Tags from "../components/Tags";
import TagCollection from "collections/TagCollection";

import { captureMessage } from "utilities/capture";

import actions from "actions";
import stores from "stores";


export default React.createClass({
    displayName: "ImageWizard-ImageInfoStep",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        imageOwner: React.PropTypes.bool.isRequired,
        helpLink: React.PropTypes.instanceOf(Backbone.Model).isRequired,
    },

    componentDidMount: function() {
        stores.ImageStore.addChangeListener(this.updateState);
        stores.TagStore.addChangeListener(this.updateState);

        this.updateState();
    },

    componentWillUnmount: function() {
        stores.ImageStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
    },

    getInitialState: function() {
        let instance = this.props.instance;
        let defaultName = "";
        let defaultDescription = "";
        if (this.props.imageOwner) {
            defaultName = instance.get("image").name;
            defaultDescription = instance.get("image").description;
        }
        let imageTags = new TagCollection(instance.get("image").tags);

        return {
            name: defaultName,
            nameError: this.setNameError(defaultName),
            description: defaultDescription,
            newImage: true,
            imageTags,
        }
    },

    updateState: function() {
        this.forceUpdate();
    },

    isValidName: function(input) {
        var invalid = /[!"'#$%&*,;<>?\/\\`{|}~^]/;

        // Return if input does /NOT/ have an invalid character
        return !invalid.test(input);
    },
    isSubmittable: function() {
        var testName = $.trim(this.state.name);
        var hasName = !!(testName);
        var validName = this.isValidName(testName);
        var hasDescription = !!($.trim(this.state.description));
        var notNullTags = this.state.imageTags != null;
        return hasName && hasDescription && validName && notNullTags;
    },

    onNext: function() {
        this.props.onNext({
            name: $.trim(this.state.name),
            description: $.trim(this.state.description),
            imageTags: this.state.imageTags,
            newImage: this.state.newImage
        });
    },
    setNameError: function(newName) {
        var invalid_characters = "!#$%^&*\"',;/\\<>?{|}~";
        if (!this.isValidName(newName)) {
            return "The name selected is using an invalid special character. " +
            "Please remove these character(s) from your name: " + invalid_characters;
        }
    },
    onNameChange: function(newName) {
        this.setState({
            name: newName,
            nameError: this.setNameError(newName)
        });
    },
    onCreateUpdateChange: function(checked) {
        this.setState({
            newImage: checked
        });
    },

    onDescriptionChange: function(newDescription) {
        this.setState({
            description: newDescription
        });
    },

    onTagAdded: function(addedTag) {
        var imageTags = this.state.imageTags;
        imageTags.add(addedTag);
        this.setState({
            imageTags: imageTags
        })
    },

    onTagCreated: function(tagObj) {
        var newTag = actions.TagActions.create(tagObj);
        var imageTags = this.state.imageTags;
        imageTags.add(newTag);
        this.setState({
            imageTags: imageTags
        })
    },
    onTagRemoved: function(removedTag) {
        var imageTags = this.state.imageTags;
        imageTags.remove(removedTag);
        this.setState({
            imageTags: imageTags
        })
    },
    renderCreateUpdateFlag: function() {
        return (
        <CreateUpdateFlag value={this.state.newImage} onChange={this.onCreateUpdateChange} />
        );
    },
    renderBody: function(instance) {
        let { helpLink } = this.props,
            link;

        if (helpLink) {
            link = helpLink.get("href");
        } else {
            link = "#";
            // NOTE: not truly an exception, just unexpected
            captureMessage("HelpLink unavailable on render", {
                component: this.displayName
            });
        }

        return (
        <div>
            <div className="alert alert-danger">
                <strong>Note:</strong> All volumes must be detached from an instance before it can be imaged.
            </div>
            <p className="alert alert-info">
                {"Please read the "}
                <a href={link} target="_blank">wiki page about requesting an image of your instance</a>
                {" before completing the form below."}
            </p>
            <p>
                {"Please provide some information to help others discover this image. The information you " +
                 "provide here will be the primary means for others to discover this image."}
            </p>
            <p>
                {"Fields marked with * are required."}
            </p>
            {this.props.imageOwner
             ? this.renderCreateUpdateFlag()
             : ""}
            <Name create={this.state.newImage}
                value={this.state.name}
                error={this.state.nameError}
                onChange={this.onNameChange} />
            <hr />
            <Description value={this.state.description} onChange={this.onDescriptionChange} />
            <hr />
            <Tags onTagAdded={this.onTagAdded}
                onTagRemoved={this.onTagRemoved}
                onTagCreated={this.onTagCreated}
                imageTags={this.state.imageTags} />
        </div>
        );
    },

    render: function() {
        var instance = this.props.instance;

        return (
        <div>
            <div className="modal-body">
                {this.renderBody(instance)}
            </div>
            <div className="modal-footer">
                <RaisedButton
                    primary
                    onTouchTap={this.onNext}
                    disabled={!this.isSubmittable()}
                    label="Next"
                />
            </div>
        </div>
        );
    }
});
