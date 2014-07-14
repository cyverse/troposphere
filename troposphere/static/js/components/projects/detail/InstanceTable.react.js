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
        onResourceSelected: React.PropTypes.func.isRequired
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
          if(instance.isRealInstance) {
            return (
              <InstanceRow key={instance.id}
                           instance={instance}
                           project={this.props.project}
                           onResourceSelected={this.props.onResourceSelected}
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
          <div>
            <div className="header">
              <i className="glyphicon glyphicon-tasks"></i>
              <h2>Instances</h2>
            </div>
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
          </div>
        );
      }

    });

  });
