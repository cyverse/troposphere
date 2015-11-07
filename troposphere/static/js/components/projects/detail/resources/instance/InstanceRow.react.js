import React from 'react/addons';
import Backbone from 'backbone';
import SelectableRow from '../SelectableRow.react';
import Name from '../tableData/instance/Name.react';
import Status from '../tableData/instance/Status.react';
import IpAddress from '../tableData/instance/IpAddress.react';
import Size from '../tableData/instance/Size.react';
import Provider from '../tableData/instance/Provider.react';
import stores from 'stores';
import CryptoJS from 'crypto-js';
import Gravatar from 'components/common/Gravatar.react';

export default React.createClass({
    displayName: "InstanceRow",

    propTypes: {
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      onPreviewResource: React.PropTypes.func.isRequired,
      isPreviewed: React.PropTypes.bool,
      isChecked: React.PropTypes.bool,

      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var instance = this.props.instance,
        instanceHash = CryptoJS.MD5((instance.id || instance.cid).toString()).toString(),
        type = stores.ProfileStore.get().get('icon_set'),
        iconSize = 18;

      return (
        <SelectableRow isActive={this.props.isPreviewed}
                       isSelected={this.props.isChecked}
                       onResourceSelected={this.props.onResourceSelected}
                       onResourceDeselected={this.props.onResourceDeselected}
                       resource={this.props.instance}
                       onPreviewResource={this.props.onPreviewResource}
          >
          <td className="image-preview sm-cell" data-label="Name">
            <Gravatar hash={instanceHash} size={iconSize} type={type}/>
            <Name instance={instance}/>
          </td>
          <td className="sm-cell" data-label="Status">
            <Status instance={instance}/>
          </td>
          <td className="sm-cell" data-label="IP Address">
            <IpAddress instance={instance}/>
          </td>
          <td className="sm-cell" data-label="Size">
            <Size instance={instance}/>
          </td>
          <td className="sm-cell" data-label="Provider">
            <Provider instance={instance}/>
          </td>
        </SelectableRow>
      );
    }
});
