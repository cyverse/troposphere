/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'url',
    './Checkbox.react',

    // Table Data
    './tableData/volume/Name.react',
    './tableData/volume/Status.react',
    './tableData/volume/Size.react',
    './tableData/volume/Provider.react'
  ],
  function (React, Backbone, URL, Checkbox, Name, Status, Size, Provider) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      },

      getInitialState: function(){
        return {
          isChecked: false
        }
      },

      toggleCheckbox: function(e){
        this.setState({isChecked: !this.state.isChecked});
        this.props.onResourceSelected(this.props.volume);
      },

      render: function () {
        var volume = this.props.volume;

        return (
          <tr>
            <td><Checkbox isChecked={this.state.isChecked} onToggleChecked={this.toggleCheckbox}/></td>
            <td>
              <Name project={this.props.project} volume={volume}/>
            </td>
            <td>
              <Status volume={volume}/>
            </td>
            <td>
              <Size volume={volume}/>
            </td>
            <td>
              <Provider volume={volume} providers={this.props.providers}/>
            </td>
          </tr>
        );
      }

    });

  });
