import React from "react";
import Backbone from "backbone";
import EditableInputField from "components/common/EditableInputField";
import EditableTextAreaField from "components/common/EditableTextAreaField";
import actions from "actions";


export default React.createClass({
    displayName: "ExternalLinkInfoSection",

    propTypes: {
        link: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function() {
        var link = this.props.link;

        return {
            name: link.get("title"),
            description: link.get("description"),
            link: link.get("link"), // The URL -not- the object.
            isEditingName: false,
            isEditingDescription: false,
            isEditingLink: false
        }
    },

    onEnterEditName: function(e) {
        this.setState({
            isEditingName: true
        });
    },

    onEnterEditDescription: function(e) {
        this.setState({
            isEditingDescription: true
        });
    },

    onEnterEditLink: function(e) {
        this.setState({
            isEditingLink: true
        });
    },

    onDoneEditingDescription: function(text) {
        var link = this.props.link;

        this.setState({
            description: text,
            isEditingDescription: false
        });
        actions.ExternalLinkActions.update(link, {
            description: text
        })
    },

    onDoneEditingLink: function(text) {
        var link = this.props.link;

        this.setState({
            link: text,
            isEditingLink: false
        });
        actions.ExternalLinkActions.update(link, {
            link: text
        })
    },

    onDoneEditingName: function(text) {
        var link = this.props.link;

        this.setState({
            name: text,
            isEditingName: false
        });
        actions.ExternalLinkActions.update(link, {
            title: text
        })
    },

    render: function() {
        var nameContent,
            descriptionContent,
            linkContent;

        if (this.state.isEditingDescription) {
            descriptionContent = (
                <EditableTextAreaField text={this.state.description} onDoneEditing={this.onDoneEditingDescription} />
            );
        } else {
            descriptionContent = (
                <h4 className="t-body-2" onClick={this.onEnterEditDescription}>{this.state.description} <i className="glyphicon glyphicon-pencil"></i></h4>
            );
        }

        if (this.state.isEditingLink) {
            linkContent = (
                <EditableInputField text={this.state.link} onDoneEditing={this.onDoneEditingLink} />
            );
        } else {
            linkContent = (
                <h4 className="t-body-2" onClick={this.onEnterEditLink}>{this.state.link} <i className="glyphicon glyphicon-pencil"></i></h4>
            );
        }

        if (this.state.isEditingName) {
            nameContent = (
                <EditableInputField text={this.state.name} onDoneEditing={this.onDoneEditingName} />
            );
        } else {
            nameContent = (
                <h4 className="t-body-2" onClick={this.onEnterEditName}>{this.state.name} <i className="glyphicon glyphicon-pencil"></i></h4>
            );
        }

        return (
        <div className="resource-info-section section clearfix">
            <div className="resource-info">
                <h2 className="t-title">Name</h2>
                <div className="resource-name editable">
                    {nameContent}
                </div>
                <h2 className="t-title">Description</h2>
                <div className="resource-name editable">
                    {descriptionContent}
                </div>
                <h2 className="t-title">Link</h2>
                <div className="resource-name editable">
                    {linkContent}
                </div>
            </div>
        </div>
        );
    }
});
