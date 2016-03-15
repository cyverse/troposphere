define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Time = require('components/common/Time.react'),
    EditableInputField = require('components/common/EditableInputField.react'),
    EditableTextAreaField = require('components/common/EditableTextAreaField.react'),
    actions = require('actions'),
    stores = require('stores'),
    CryptoJS = require('crypto-js'),
    Gravatar = require('components/common/Gravatar.react');

  return React.createClass({
    displayName: "ExternalLinkInfoSection",

    propTypes: {
      external_link: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function () {
      var link = this.props.external_link;

      return {
        name: link.get('title'),
        description: link.get('description'),
        link: link.get('link'), // The URL -not- the object.
        isEditingName: false,
        isEditingDescription: false,
        isEditingLink: false
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
      var link = this.props.external_link;

      this.setState({
        description: text,
        isEditingDescription: false
      });
      actions.ExternalLinkActions.update(link, {description: text})
    },

    onDoneEditingLink: function (text) {
      var link = this.props.external_link;

      this.setState({
        link: text,
        isEditingLink: false
      });
      actions.ExternalLinkActions.update(link, {link: text})
    },

    onDoneEditingName: function (text) {
      var link = this.props.external_link;

      this.setState({
        name: text,
        isEditingName: false
      });
      actions.ExternalLinkActions.update(link, {title: text})
    },

    render: function () {
      var link = this.props.external_link,
        profile = stores.ProfileStore.get(),
        type = profile.get('icon_set'),
        instanceHash = CryptoJS.MD5((link.id || link.cid).toString()).toString(),
        iconSize = 113,
        nameContent, descriptionContent, linkContent;

      if (this.state.isEditingDescription) {
        descriptionContent = (
          <EditableTextAreaField text={this.state.description} onDoneEditing={this.onDoneEditingDescription}/>
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
          <EditableInputField text={this.state.link} onDoneEditing={this.onDoneEditingLink}/>
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
          <EditableInputField text={this.state.name} onDoneEditing={this.onDoneEditingName}/>
        );
      } else {
        nameContent = (
          <h4 onClick={this.onEnterEditName}>
            {this.state.name}
            <i className="glyphicon glyphicon-pencil"></i>
          </h4>
        );
      }

      return (
        <div className="resource-info-section section clearfix">

          <div className="resource-info">
            <h2>Name</h2>
            <div className="resource-name editable">
              {nameContent}
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

});
