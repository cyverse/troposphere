define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Checkbox = require('./Checkbox.react');

  return React.createClass({
    displayName: "SelectableTable",

    propTypes: {
      resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      resourceRows: React.PropTypes.node.isRequired,
      selectedResources: React.PropTypes.instanceOf(Backbone.Collection),
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
    },

    toggleCheckbox: function (e) {
      var isChecked = this.areAllResourcesSelected();

      this.props.resources.each(function (resource) {
        if (!isChecked) {
          this.props.onResourceSelected(resource);
        } else {
          this.props.onResourceDeselected(resource);
        }
      }.bind(this));
    },

    areAllResourcesSelected: function () {
      var allResourcesSelected = true;
      this.props.resources.each(function (resource) {
        if (!this.props.selectedResources.get(resource)) allResourcesSelected = false;
      }.bind(this));
      return allResourcesSelected;
    },

    render: function () {
      return (
        <table className="table table-hover sm-table">
          <thead className="sm-thead">
          <tr className="sm-row" onClick={this.toggleCheckbox}>
            <th className="sm-header"><Checkbox isChecked={this.areAllResourcesSelected()}/></th>
            <th className="sm-header">Name</th>
            <th className="sm-header">Status</th>
            <th className="sm-header">IP Address</th>
            <th className="sm-header">Size</th>
            <th className="sm-header">Provider</th>
          </tr>
          </thead>
          <tbody className="sm-tbody">
          {this.props.resourceRows}
          </tbody>
        </table>
      );
    }

  });

});
