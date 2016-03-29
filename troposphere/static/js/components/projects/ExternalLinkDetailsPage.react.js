define(function (require) {

  var React = require('react/addons'),
    ProjectResourcesWrapper = require('./detail/resources/ProjectResourcesWrapper.react'),
    ExternalLinkDetailsView = require('./resources/link/details/ExternalLinkDetailsView.react'),
    Router = require('react-router'),
    stores = require('stores');

  return React.createClass({
    displayName: "ExternalLinkDetailsPage",

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId));
      var linkId = this.getParams().linkId;
      var link = stores.ExternalLinkStore.get(linkId);

      if (!project || !link) return <div className="loading"></div>;

      return (
        <ProjectResourcesWrapper project={project}>
          <ExternalLinkDetailsView project={project} link={link}/>
        </ProjectResourcesWrapper>
      );
    }

  });

});
