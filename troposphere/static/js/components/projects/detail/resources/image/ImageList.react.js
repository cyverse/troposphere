import React from 'react/addons';
import Backbone from 'backbone';
import ImageTable from './ImageTable.react';
import NoImageNotice from './NoImageNotice.react';

export default React.createClass({
    displayName: "ImageList",

    propTypes: {
      images: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      onPreviewResource: React.PropTypes.func.isRequired,
      previewedResource: React.PropTypes.instanceOf(Backbone.Model),
      selectedResources: React.PropTypes.instanceOf(Backbone.Collection)
    },

    render: function () {
      var images = this.props.images,
        content;

      if (this.props.images.length <= 0) {
        content = (
          <NoImageNotice/>
        );
      } else {
        content = (
          <ImageTable
            images={images}
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
            <i className="glyphicon glyphicon-floppy-disk"></i>

            <h3 className="title-3">Images</h3>
          </div>
          {content}
        </div>
      );
    }
});
