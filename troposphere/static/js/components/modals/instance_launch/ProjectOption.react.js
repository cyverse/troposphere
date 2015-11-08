import React from 'react';
import Backbone from 'backbone';

export default React.createClass({
      displayName: "ProjectOption",

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var project = this.props.project;

        return (
          <option value={project.id}>
            {project.get('name')}
          </option>
        );
      }
});
