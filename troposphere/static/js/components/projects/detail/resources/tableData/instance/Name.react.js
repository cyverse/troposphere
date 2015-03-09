define(function (require) {
  "use strict";

  var React = require('react'),
      Backbone = require('backbone'),
      Router = require('react-router');

  return React.createClass({

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var instance = this.props.instance,
          projectId = instance.get('projects')[0];

      if(!instance.id) {
        return (
          <span>{instance.get('name')}</span>
        );
      }

      return (
        <Router.Link to="project-instance-details" params={{projectId: projectId, instanceId: instance.id}}>
          {instance.get('name')}
        </Router.Link>
      );
    }

  });

});
