/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'url',
    './Checkbox.react',

    // Table Data
    './tableData/instance/Name.react',
    './tableData/instance/Status.react',
    './tableData/instance/IpAddress.react',
    './tableData/instance/Size.react',
    './tableData/instance/Provider.react'
  ],
  function (React, Backbone, URL, Checkbox, Name, Status, IpAddress, Size, Provider) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        isSelected: React.PropTypes.bool
      },

      getInitialState: function(){
        return {
          isChecked: false
        }
      },

      toggleCheckbox: function(e){
        this.setState({isChecked: !this.state.isChecked});
        this.props.onResourceSelected(this.props.instance);
      },

      render: function () {
        var project = this.props.project,
            instance = this.props.instance;

        var rowClassName = this.props.isSelected ? "selected" : null;

        return (
          <tr className={rowClassName}>
            <td>
              <Checkbox isChecked={this.state.isChecked} onToggleChecked={this.toggleCheckbox}/>
            </td>
            <td>
              <Name project={project} instance={instance}/>
            </td>
            <td>
              <Status instance={instance}/>
            </td>
            <td>
              <IpAddress instance={instance}/>
            </td>
            <td>
              <Size/>
            </td>
            <td>
              <Provider instance={instance} providers={this.props.providers}/>
            </td>
          </tr>
        );
      }

    });

  });
