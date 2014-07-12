/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceRow.react'
  ],
  function (React, Backbone, InstanceRow) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired
      },

      render: function () {
        var instanceRows = this.props.instances.map(function(instance){
          return (
            <InstanceRow key={instance.id}
                         instance={instance}
                         project={this.props.project}
                         onResourceSelected={this.props.onResourceSelected}
            />
          );
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
                  <th><div className="resource-checkbox"></div></th>
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
