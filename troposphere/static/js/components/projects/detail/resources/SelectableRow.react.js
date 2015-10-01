define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Checkbox = require('./Checkbox.react');

  return React.createClass({

    propTypes: {
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      onPreviewResource: React.PropTypes.func.isRequired,
      isActive: React.PropTypes.bool,
      isSelected: React.PropTypes.bool,
      children: React.PropTypes.node.isRequired,
      resource: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    toggleCheckbox: function (e) {
      e.stopPropagation();
      if (!this.props.resource.id) return;

      if (this.props.isSelected) {
        this.props.onResourceDeselected(this.props.resource);
      } else {
        this.props.onResourceSelected(this.props.resource);
      }
    },

    previewResource: function (e) {
      if (this.props.onPreviewResource && this.props.resource.id) {
        this.props.onPreviewResource(this.props.resource);
      }
    },

    render: function () {
      var rowClassName = this.props.isActive ? "selected" : null;

      return (
        <tr className={"sm-row " + rowClassName} style={{cursor:"pointer"}} onClick={this.previewResource}>
          <td className="sm-cell hidden-sm hidden-xs" onClick={this.toggleCheckbox}>
            <Checkbox isChecked={this.props.isSelected}/>
          </td>
          {this.props.children}
        </tr>
      );
    }

  });

});
