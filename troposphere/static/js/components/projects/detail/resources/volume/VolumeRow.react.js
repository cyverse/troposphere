define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      SelectableRow = require('../SelectableRow.react'),
      Name = require('../tableData/volume/Name.react'),
      Status = require('../tableData/volume/Status.react'),
      Size = require('../tableData/volume/Size.react'),
      Provider = require('../tableData/volume/Provider.react'),
      stores = require('stores'),
      CryptoJS = require('crypto'),
      Gravatar = require('components/common/Gravatar.react');

  return React.createClass({
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
          volumeHash = CryptoJS.MD5(volume.id.toString()).toString(),
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
          <td className="image-preview">
            <Gravatar
              hash={volumeHash}
              size={iconSize}
              type={type}
            />
            <Name volume={volume}/>
          </td>
          <td>
            <Status volume={volume}/>
          </td>
          <td>
            <Size volume={volume}/>
          </td>
          <td>
            <Provider volume={volume}/>
          </td>
        </SelectableRow>
      );
    }

  });

});
