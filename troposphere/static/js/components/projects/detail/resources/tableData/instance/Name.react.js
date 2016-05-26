import React from 'react';
import Backbone from 'backbone';
import Router from 'react-router';

export default React.createClass({
    displayName: "Name",

    mixins: [Router.State],

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var instance = this.props.instance,
          name = instance.get('name').trim() || "[no instance name]";

      if (!instance.id) {
        return (
          <span>{instance.get('name')}</span>
        );
      }

      return (
        <Router.Link to="project-instance-details" params={{projectId: this.getParams().projectId, instanceId: instance.id}}>
          {name}
        </Router.Link>
      );
    }
});
