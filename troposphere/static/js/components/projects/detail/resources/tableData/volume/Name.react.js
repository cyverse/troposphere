define(function (require) {
  "use strict";

  var React = require('react'),
      Backbone = require('backbone'),
      Router = require('react-router');

  return React.createClass({

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var volume = this.props.volume,
          projectId = volume.get('projects')[0];

      if(!volume.id) {
        return (
          <span>{volume.get('name')}</span>
        );
      }

      return (
        <Router.Link to="project-volume-details" params={{projectId: projectId, volumeId: volume.id}}>
          {volume.get('name')}
        </Router.Link>
      );
    }

  });

});
