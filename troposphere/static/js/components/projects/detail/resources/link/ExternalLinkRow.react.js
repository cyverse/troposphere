import React from 'react/addons';
import Backbone from 'backbone';
import SelectableRow from '../SelectableRow.react';
import Name from '../tableData/link/Name.react';
import Link from '../tableData/link/Link.react';
import stores from 'stores';
import CryptoJS from 'crypto-js';
import Gravatar from 'components/common/Gravatar.react';


export default React.createClass({
    displayName: "ExternalLinkRow",

    propTypes: {
      external_link: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      onPreviewResource: React.PropTypes.func.isRequired,
      isPreviewed: React.PropTypes.bool,
      isChecked: React.PropTypes.bool
    },

    render: function () {
      var external_link = this.props.external_link,
        linkHash = CryptoJS.MD5((external_link.id || external_link.cid).toString()).toString(),
        type = stores.ProfileStore.get().get('icon_set'),
        iconSize = 18;

      return (
        <SelectableRow
          isActive={this.props.isPreviewed}
          isSelected={this.props.isChecked}
          onResourceSelected={this.props.onResourceSelected}
          onResourceDeselected={this.props.onResourceDeselected}
          onPreviewResource={this.props.onPreviewResource}
          resource={external_link}
          >
          <td className="image-preview sm-cell" data-label="Name">
            <Name external_link={external_link}/>
          </td>
          <td className="image-preview sm-cell" data-label="Link">
            <Link external_link={external_link}/>
          </td>
        </SelectableRow>
      );
    }
});
