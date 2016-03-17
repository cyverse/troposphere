define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Button = require('./Button.react'),
    actions = require('actions'),
    modals = require('modals');

  return React.createClass({
    displayName: "ImageActionButtons",

    propTypes: {
      multipleSelected: React.PropTypes.bool.isRequired,
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onDelete: function () {
      this.props.onUnselect(this.props.image);
      modals.ProjectModals.removeResources(
        new Backbone.Collection([this.props.image]),
        this.props.project
      );
    },

    render: function () {
      var image = this.props.image,
        linksArray = [];
      linksArray.push(
        <Button
          key="Delete"
          icon="remove"
          tooltip="Delete"
          onClick={this.onDelete}
          isVisible={true}
          />
      );

      return (
        <div style={{borderLeft: "1px solid #ddd", display: "inline-block", paddingLeft: "10px", float: "right"}}>
          {linksArray}
        </div>
      );
    }

  });

});
