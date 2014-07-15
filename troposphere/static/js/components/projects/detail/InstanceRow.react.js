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
        onResourceDeselected: React.PropTypes.func.isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        isPreviewed: React.PropTypes.bool,
        isChecked: React.PropTypes.bool
      },

      toggleCheckbox: function(e){
        if(this.props.isChecked){
          this.props.onResourceDeselected(this.props.instance);
        }else{
          this.props.onResourceSelected(this.props.instance);
        }
      },

      render: function () {
        var project = this.props.project,
            instance = this.props.instance;

        var rowClassName = this.props.isPreviewed ? "selected" : null;

        return (
          <tr className={rowClassName} onClick={this.toggleCheckbox}>
            <td>
              <Checkbox isChecked={this.props.isChecked} onToggleChecked={this.toggleCheckbox}/>
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
