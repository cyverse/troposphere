/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceRow.react',
    './InstanceNotRealRow.react',
    './Checkbox.react'
  ],
  function (React, Backbone, InstanceRow, InstanceNotRealRow, Checkbox) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        selectedResource: React.PropTypes.instanceOf(Backbone.Model)
      },

      getInitialState: function(){
        return {
          isChecked: false
        }
      },

      toggleCheckbox: function(e){
        this.setState({isChecked: !this.state.isChecked});
      },

      render: function () {
        var instanceRows = this.props.instances.map(function(instance){
          var isSelected = (this.props.selectedResource === instance);
          if(instance.isRealInstance) {
            return (
              <InstanceRow key={instance.id}
                           instance={instance}
                           project={this.props.project}
                           onResourceSelected={this.props.onResourceSelected}
                           providers={this.props.providers}
                           isSelected={isSelected}
              />
            );
          }else{
            return (
              <InstanceNotRealRow key={instance.id}
                                  instance={instance}
                                  project={this.props.project}
              />
            );
          }
        }.bind(this));

        return (
          <table className="table table-hover">
            <thead>
              <tr>
                <th><Checkbox isChecked={this.state.isChecked} onToggleChecked={this.toggleCheckbox}/></th>
                <th>Name</th>
                <th>Status</th>
                <th>IP Address</th>
                <th>Size</th>
                <th>Provider</th>
              </tr>
            </thead>
            <tbody>
              {instanceRows}
            </tbody>
          </table>
        );
      }

    });

  });
