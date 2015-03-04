define(function (require) {
  "use strict";

  var React = require('react'),
      Backbone = require('backbone'),
      Router = require('react-router');

  return React.createClass({

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var project = this.props.project,
          volume = this.props.volume;

      if(volume.id) {
        return (
          <Router.Link to="project-volume-details" params={{projectId: project.id, volumeId: volume.id}}>
            {volume.get('name')}
          </Router.Link>
        );
      }else{
        return (
          <span>{volume.get('name')}</span>
        );
      }
    }

  });

});
