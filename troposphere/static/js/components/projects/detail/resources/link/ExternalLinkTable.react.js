import React from 'react/addons';
import Backbone from 'backbone';
import ExternalLinkRow from './ExternalLinkRow.react';
import SelectableTable from '../SelectableTable.react';


export default React.createClass({
    displayName: "ExternalLinkTable",

    propTypes: {
      external_links: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      onPreviewResource: React.PropTypes.func.isRequired,
      previewedResource: React.PropTypes.instanceOf(Backbone.Model),
      selectedResources: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getInitialState: function () {
      return {
        isChecked: false
      }
    },

    toggleCheckbox: function (e) {
      this.setState({isChecked: !this.state.isChecked});
    },

    getExternalLinkRows: function (external_links) {
      var previewedResource = this.props.previewedResource,
        selectedResources = this.props.selectedResources;

      return external_links.map(function (external_link) {
        var isPreviewed = (previewedResource === external_link),
          isChecked = selectedResources.get(external_link) ? true : false;

        return (
          <ExternalLinkRow
            key={external_link.id || external_link.cid}
            external_link={external_link}
            onResourceSelected={this.props.onResourceSelected}
            onResourceDeselected={this.props.onResourceDeselected}
            onPreviewResource={this.props.onPreviewResource}
            isPreviewed={isPreviewed}
            isChecked={isChecked}
            />
        );
      }.bind(this));
    },

    render: function () {
      var external_links = this.props.external_links,
        linkRows = this.getExternalLinkRows(external_links);

      return (
        <SelectableTable
          resources={external_links}
          selectedResources={this.props.selectedResources}
          resourceRows={linkRows}
          onResourceSelected={this.props.onResourceSelected}
          onResourceDeselected={this.props.onResourceDeselected}
          >
          <th className="sm-header">Name</th>
        </SelectableTable>
      )
    }
});
