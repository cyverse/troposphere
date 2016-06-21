import React from 'react';
import $ from 'jquery';
import Backbone from 'backbone';
import Time from 'components/common/Time.react';
import EditableInputField from 'components/common/EditableInputField.react';
import EditableTextAreaField from 'components/common/EditableTextAreaField.react';
import actions from 'actions';
import stores from 'stores';
import CryptoJS from 'crypto-js';
import Gravatar from 'components/common/Gravatar.react';


export default React.createClass({
    displayName: "ExternalLinkInfoSection",

    propTypes: {
      link: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function () {
      var link = this.props.link;

      return {
        //Current State variables
        nameErrorText: "",
        isEditingName: false,
        isEditingDescription: false,
        isEditingLink: false,
        //Fields that can be edited
        description: link.get('description'),
        name: link.get('title'),
        link: link.get('link') // The URL -not- the object.
      }
    },

    onEnterEditName: function (e) {
      this.setState({isEditingName: true});
    },

    onEnterEditDescription: function (e) {
      this.setState({isEditingDescription: true});
    },

    onEnterEditLink: function (e) {
      this.setState({isEditingLink: true});
    },

    onDoneEditingDescription: function (text) {
      var link = this.props.link;

      this.setState({
        description: text,
        isEditingDescription: false
      });
      actions.ExternalLinkActions.update(link, {description: text})
    },

    onDoneEditingLink: function (text) {
      var link = this.props.link;

      this.setState({
        link: text,
        isEditingLink: false
      });
      actions.ExternalLinkActions.update(link, {link: text})
    },

    onDoneEditingName: function (text) {
      var link = this.props.link;
      var project = this.props.project;
      if(this.validateTitle(text, project) == false) {
          let titleMessage = "Link with name \"" + text + "\" already exists in this project.";
          this.setState({
            nameErrorText: titleMessage
          });
      } else {
          this.setState({
            name: text,
            isEditingName: false,
            nameErrorText: ""
          });
          actions.ExternalLinkActions.update(link, {title: text})
      }
    },

    validateTitle: function (title, project) {
        let lower = $.trim(title.toLowerCase());
        let allLinks = stores.ProjectExternalLinkStore.getAll();
        let externalLinks = allLinks.filter(function (projectExternalLink) {
            if(project && project.id === projectExternalLink.get('project').id) {
                return projectExternalLink.get('external_link')
                    .title.toLowerCase() === lower;
            } else {
                // If no project is given, do not validate the title.
                return false;
            }
        });
        return (externalLinks.length > 0) ? false : true;
    },

    render: function () {
      var link = this.props.link,
        profile = stores.ProfileStore.get(),
        type = profile.get('icon_set'),
        instanceHash = CryptoJS.MD5((link.id || link.cid).toString()).toString(),
        iconSize = 113,
        nameError, nameContent, descriptionContent, linkContent;

      if (this.state.isEditingDescription) {
        descriptionContent = (
          <EditableTextAreaField
            text={this.state.description}
            onDoneEditing={this.onDoneEditingDescription}/>
        );
      } else {
        descriptionContent = (
          <h4 onClick={this.onEnterEditDescription}>
            {this.state.description}
            <i className="glyphicon glyphicon-pencil"></i>
          </h4>
        );
      }

      if (this.state.isEditingLink) {
        linkContent = (
          <EditableInputField
            text={this.state.link}
            onDoneEditing={this.onDoneEditingLink}/>
        );
      } else {
        linkContent = (
          <h4 onClick={this.onEnterEditLink}>
            {this.state.link}
            <i className="glyphicon glyphicon-pencil"></i>
          </h4>
        );
      }

      if (this.state.isEditingName) {
        nameContent = (
          <EditableInputField
            text={this.state.name}
            onDoneEditing={this.onDoneEditingName}/>
        );
      } else {
        nameContent = (
          <h4 onClick={this.onEnterEditName}>
            {this.state.name}
            <i className="glyphicon glyphicon-pencil"></i>
          </h4>
        );
      }

      if (this.state.nameErrorText !== "") {
        nameError = (
          <p className="no-results text-danger">
            {this.state.nameErrorText}
          </p>
        );
      } else {
        nameError = (
          <p className="no-results text-danger"></p>
        );
      }

      return (
        <div className="resource-info-section section clearfix">

          <div className="resource-info">
            <h2>Name</h2>
            <div className="resource-name editable">
              {nameContent}
              {nameError}
            </div>
            <h2>Description</h2>
            <div className="resource-name editable">
              {descriptionContent}
            </div>
            <h2>Link</h2>
            <div className="resource-name editable">
              {linkContent}
            </div>
          </div>

        </div>
      );
    }
});
