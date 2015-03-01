/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',

    // Base Row
    '../SelectableRow.react',

    // Table Data
    '../tableData/instance/Name.react',
    '../tableData/instance/Status.react',
    '../tableData/instance/IpAddress.react',
    '../tableData/instance/Size.react',
    '../tableData/instance/Provider.react',

    'stores',
    'crypto',
    'components/common/Gravatar.react'
  ],
  function (React, Backbone, SelectableRow, Name, Status, IpAddress, Size, Provider, stores, CryptoJS, Gravatar) {

    return React.createClass({

      propTypes: {
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,
        onPreviewResource: React.PropTypes.func.isRequired,
        isPreviewed: React.PropTypes.bool,
        isChecked: React.PropTypes.bool,

        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var project = this.props.project;
        var instance = this.props.instance;

        var instanceHash = CryptoJS.MD5(instance.id.toString()).toString();
        var type = stores.ProfileStore.get().get('icon_set');
        var iconSize = 18;

        return (
          <SelectableRow isActive={this.props.isPreviewed}
                         isSelected={this.props.isChecked}
                         onResourceSelected={this.props.onResourceSelected}
                         onResourceDeselected={this.props.onResourceDeselected}
                         resource={this.props.instance}
                         onPreviewResource={this.props.onPreviewResource}
          >
            <td className="image-preview">
              <Gravatar hash={instanceHash} size={iconSize} type={type}/>
              <Name project={project} instance={instance}/>
            </td>
            <td>
              <Status instance={instance}/>
            </td>
            <td>
              <IpAddress instance={instance}/>
            </td>
            <td>
              <Size instance={instance}/>
            </td>
            <td>
              <Provider instance={instance} providers={this.props.providers}/>
            </td>
          </SelectableRow>
        );
      }

    });

  });
