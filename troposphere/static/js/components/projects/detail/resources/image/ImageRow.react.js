import React from 'react';
import Backbone from 'backbone';
import SelectableRow from '../SelectableRow.react';
import Name from '../tableData/image/Name.react';
import stores from 'stores';
import CryptoJS from 'crypto-js';
import Gravatar from 'components/common/Gravatar.react';


export default React.createClass({
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
