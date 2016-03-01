import React from 'react';
import Backbone from 'backbone';
import SelectableRow from '../SelectableRow.react';
import Name from '../tableData/volume/Name.react';
import Status from '../tableData/volume/Status.react';
import Size from '../tableData/volume/Size.react';
import Provider from '../tableData/volume/Provider.react';
import stores from 'stores';
import CryptoJS from 'crypto-js';
import Gravatar from 'components/common/Gravatar.react';

export default React.createClass({
    displayName: "VolumeRow",

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      onPreviewResource: React.PropTypes.func.isRequired,
      isPreviewed: React.PropTypes.bool,
      isChecked: React.PropTypes.bool
    },

    render: function () {
      var volume = this.props.volume,
        volumeHash = CryptoJS.MD5((volume.id || volume.cid).toString()).toString(),
        type = stores.ProfileStore.get().get('icon_set'),
        iconSize = 18;

      return (
        <SelectableRow
          isActive={this.props.isPreviewed}
          isSelected={this.props.isChecked}
          onResourceSelected={this.props.onResourceSelected}
          onResourceDeselected={this.props.onResourceDeselected}
          onPreviewResource={this.props.onPreviewResource}
          resource={volume}
          >
          <td className="image-preview sm-cell" data-label="Name">
            <Gravatar
              hash={volumeHash}
              size={iconSize}
              type={type}
              />
            <Name volume={volume}/>
          </td>
          <td className="sm-cell" data-label="Status">
            <Status volume={volume}/>
          </td>
          <td className="sm-cell" data-label="Size">
            <Size volume={volume}/>
          </td>
          <td className="sm-cell" data-label="Provider">
            <Provider volume={volume}/>
          </td>
        </SelectableRow>
      );
    }
});
