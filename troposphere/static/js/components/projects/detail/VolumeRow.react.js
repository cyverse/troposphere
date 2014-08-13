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
    './tableData/volume/Provider.react'
  ],
  function (React, Backbone, SelectableRow, Name, Status, Size, Provider) {

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
        var project = this.props.project,
            volume = this.props.volume;

        return (
          <SelectableRow isActive={this.props.isPreviewed}
                         isSelected={this.props.isChecked}
                         onResourceSelected={this.props.onResourceSelected}
                         onResourceDeselected={this.props.onResourceDeselected}
                         resource={volume}
          >
            <td>
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
