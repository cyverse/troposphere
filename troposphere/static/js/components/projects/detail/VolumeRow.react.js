/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',

    // Base Row
    './SelectableRow.react',

    // Table Data
    './tableData/volume/Name.react',
    './tableData/volume/Status.react',
    './tableData/volume/Size.react',
    './tableData/volume/Provider.react',

    'stores',
    'crypto',
    'components/common/Gravatar.react'
  ],
  function (React, Backbone, SelectableRow, Name, Status, Size, Provider, stores, CryptoJS, Gravatar) {

    return React.createClass({
      displayName: "VolumeRow",

      propTypes: {
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,
        isPreviewed: React.PropTypes.bool,
        isChecked: React.PropTypes.bool,

        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var project = this.props.project;
        var volume = this.props.volume;

        var instanceHash = CryptoJS.MD5(volume.id).toString();
        var type = stores.ProfileStore.get().get('icon_set');
        var iconSize = 18;

        return (
          <SelectableRow isActive={this.props.isPreviewed}
                         isSelected={this.props.isChecked}
                         onResourceSelected={this.props.onResourceSelected}
                         onResourceDeselected={this.props.onResourceDeselected}
                         resource={volume}
          >
            <td className="image-preview">
              <Gravatar hash={instanceHash} size={iconSize} type={type}/>
              <Name project={project} volume={volume}/>
            </td>
            <td>
              <Status volume={volume} instances={this.props.instances}/>
            </td>
            <td>
              <Size volume={volume}/>
            </td>
            <td>
              <Provider volume={volume} providers={this.props.providers}/>
            </td>
          </SelectableRow>
        );
      }

    });

  });
