define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      actions = require('actions');

  return React.createClass({

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onCreateVolume: function(e){
      e.preventDefault();
      actions.VolumeActions.createAndAddToProject({project: this.props.project});
    },

    render: function () {
      return (
        <p>
          You have not added any volumes to this project.
          <a href="#" onClick={this.onCreateVolume}>
            Create a volume.
          </a>
        </p>
      );
    }

  });

});
