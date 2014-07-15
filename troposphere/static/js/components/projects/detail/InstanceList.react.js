/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceTable.react',
    './NoInstanceNotice.react'
  ],
  function (React, Backbone, InstanceTable, NoInstanceNotice) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInstanceContent: function(){
        if(this.props.instances.length > 0){
          return (
            <InstanceTable instances={this.props.instances}
                           project={this.props.project}
                           onResourceSelected={this.props.onResourceSelected}
                           providers={this.props.providers}
            />
          );
        }else{
          return (
            <NoInstanceNotice/>
          );
        }
      },

      render: function () {
        return (
          <div>
            <div className="header">
              <i className="glyphicon glyphicon-tasks"></i>
              <h2>Instances</h2>
            </div>
            {this.getInstanceContent()}
          </div>
        );
      }

    });

  });
