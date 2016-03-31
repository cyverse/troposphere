import React from 'react/addons';
import Backbone from 'backbone';
import ExternalLinkTable from './ExternalLinkTable.react';
import NoExternalLinkNotice from './NoExternalLinkNotice.react';


export default React.createClass({
    displayName: "ExternalLinkList",

    propTypes: {
      external_links: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      onPreviewResource: React.PropTypes.func.isRequired,
      previewedResource: React.PropTypes.instanceOf(Backbone.Model),
      selectedResources: React.PropTypes.instanceOf(Backbone.Collection)
    },

    render: function () {
      var external_links = this.props.external_links,
        content;

      if (this.props.external_links.length <= 0) {
        content = (
          <NoExternalLinkNotice/>
        );
      } else {
        content = (
          <ExternalLinkTable
            external_links={external_links}
            onResourceSelected={this.props.onResourceSelected}
            onResourceDeselected={this.props.onResourceDeselected}
            onPreviewResource={this.props.onPreviewResource}
            previewedResource={this.props.previewedResource}
            selectedResources={this.props.selectedResources}
            />
        );
      }

      return (
        <div>
          <div className="header">
            <i className="glyphicon glyphicon-globe"></i>

            <h3 className="title-3">Links</h3>
          </div>
          {content}
        </div>
      );
    }
});
