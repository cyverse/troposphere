define(function (require) {
  "use strict";

  var React = require('react'),
      Backbone = require('backbone'),
      Router = require('react-router');

  return React.createClass({

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var project = this.props.project,
          instance = this.props.instance;

      if(instance.id) {
        return (
          <Router.Link to="project-instance-details" params={{projectId: project.id, instanceId: instance.id}}>
            {instance.get('name')}
          </Router.Link>
        );
      }else{
        return (
          <span>{instance.get('name')}</span>
        );
      }
    }

  });

});
