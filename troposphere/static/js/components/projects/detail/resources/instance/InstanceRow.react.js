import Activity from '../tableData/instance/Activity.react'

define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    SelectableRow = require('../SelectableRow.react'),
    Name = require('../tableData/instance/Name.react'),
    Status = require('../tableData/instance/Status.react'),
    IpAddress = require('../tableData/instance/IpAddress.react'),
    Size = require('../tableData/instance/Size.react'),
    Provider = require('../tableData/instance/Provider.react'),
    stores = require('stores'),
    CryptoJS = require('crypto-js'),
    Gravatar = require('components/common/Gravatar.react');

  return React.createClass({
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
          <td className="sm-cell" data-label="Activity">
            <Activity instance={instance}/>
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

});
