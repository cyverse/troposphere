import React from 'react';
import Backbone from 'backbone';
import Router from 'react-router';

export default React.createClass({

    mixins: [Router.State],

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var volume = this.props.volume;

      if (!volume.id) {
        return (
          <span>{volume.get('name')}</span>
        );
      }

      return (
        <Router.Link to="project-volume-details" params={{projectId: this.getParams().projectId, volumeId: volume.id}}>
          {volume.get('name')}
        </Router.Link>
      );
    }
});
