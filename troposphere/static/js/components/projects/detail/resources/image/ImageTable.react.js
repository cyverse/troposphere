import React from 'react/addons';
import Backbone from 'backbone';
import ImageRow from './ImageRow.react';
import SelectableTable from '../SelectableTable.react';

export default React.createClass({
    displayName: "ImageTable",

    propTypes: {
      images: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
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

    getImageRows: function (images) {
      var previewedResource = this.props.previewedResource,
        selectedResources = this.props.selectedResources;

      return images.map(function (image) {
        var isPreviewed = (previewedResource === image),
          isChecked = selectedResources.get(image) ? true : false;

        return (
          <ImageRow
            key={image.id || image.cid}
            image={image}
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
      var images = this.props.images,
        imageRows = this.getImageRows(images);

      return (
        <SelectableTable
          resources={images}
          selectedResources={this.props.selectedResources}
          resourceRows={imageRows}
          onResourceSelected={this.props.onResourceSelected}
          onResourceDeselected={this.props.onResourceDeselected}
          >
          <th className="sm-header">Name</th>
        </SelectableTable>
      )
    }
});
