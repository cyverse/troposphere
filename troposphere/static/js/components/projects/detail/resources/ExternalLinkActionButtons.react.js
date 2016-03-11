define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Button = require('./Button.react'),
    actions = require('actions'),
    modals = require('modals');

  return React.createClass({
    displayName: "ExternalLinkActionButtons",

    propTypes: {
      multipleSelected: React.PropTypes.bool.isRequired,
      external_link: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onDelete: function () {
      this.props.onUnselect(this.props.external_link);
      modals.ExternalLinkModals.destroy({
        external_link: this.props.external_link,
        project: this.props.project
      });
    },

    render: function () {
      var external_link = this.props.external_link,
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
