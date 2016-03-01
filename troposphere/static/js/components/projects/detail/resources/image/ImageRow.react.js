define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    SelectableRow = require('../SelectableRow.react'),
    Name = require('../tableData/image/Name.react'),
    stores = require('stores'),
    CryptoJS = require('crypto-js'),
    Gravatar = require('components/common/Gravatar.react');

  return React.createClass({
    displayName: "ImageRow",

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      onPreviewResource: React.PropTypes.func.isRequired,
      isPreviewed: React.PropTypes.bool,
      isChecked: React.PropTypes.bool
    },

    render: function () {
      var image = this.props.image,
        imageHash = CryptoJS.MD5((image.id || image.cid).toString()).toString(),
        type = stores.ProfileStore.get().get('icon_set'),
        iconSize = 18;

      return (
        <SelectableRow
          isActive={this.props.isPreviewed}
          isSelected={this.props.isChecked}
          onResourceSelected={this.props.onResourceSelected}
          onResourceDeselected={this.props.onResourceDeselected}
          onPreviewResource={this.props.onPreviewResource}
          resource={image}
          >
          <td className="image-preview sm-cell" data-label="Name">
            <Gravatar
              hash={imageHash}
              size={iconSize}
              type={type}
              />
            <Name image={image}/>
          </td>
        </SelectableRow>
      );
    }

  });

});
