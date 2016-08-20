import React from 'react';
import Backbone from 'backbone';
import Showdown from 'showdown';
import globals from 'globals';

export default React.createClass({
      displayName: "ViewDetails",

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      // ------
      // Render
      // ------

      renderName: function (project) {
        return (
          <div className="project-info-segment row">
            <h4 className="col-md-3">Name</h4>

            <p className="col-md-9">{project.get('name')}</p>
          </div>
        );
      },

      renderDateCreated: function (project) {
        var start_date = project.get('start_date')
                                .tz(globals.TZ_REGION)
                                .format("MMM Do YYYY hh:mm a z");
        return (
          <div className="project-info-segment row">
            <h4 className="col-md-3">Created</h4>

            <p className="col-md-9">{start_date}</p>
          </div>
        );
      },

      renderDescription: function (project) {
        var converter = new Showdown.Converter(),
          description = project.get('description'),
          descriptionHtml = converter.makeHtml(description);

        return (
          <div className="project-info-segment row">
            <h4 className="col-md-3">Description</h4>

            <div className="col-md-9" dangerouslySetInnerHTML={{__html: descriptionHtml}}/>
          </div>
        )
      },

      render: function () {
        var project = this.props.project;

        return (
          <div>
            {this.renderName(project)}
            {this.renderDateCreated(project)}
            {this.renderDescription(project)}
          </div>
        );
      }
});
