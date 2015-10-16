define(function (require) {

  var React = require('react/addons'),
    ProjectResourcesWrapper = require('./detail/resources/ProjectResourcesWrapper.react'),
    ProjectDetails = require('./detail/resources/ProjectDetails.react'),
    stores = require('stores'),
    Router = require('react-router');

  return React.createClass({
    displayName: "ProjectResouresPage",

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId));

      if (!project) {
        return (
          <div className="loading"></div>
        );
      }

      return (
        <ProjectResourcesWrapper project={project}>
          <ProjectDetails project={project}/>
        </ProjectResourcesWrapper>
      );
    }

  });

});
