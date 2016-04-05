define(function (require) {

  var React = require('react/addons'),
    stores = require('stores'),
    ProjectResourcesWrapper = require('./detail/resources/ProjectResourcesWrapper.react'),
    InstanceDetailsView = require('./resources/instance/details/InstanceDetailsView.react'),
    Router = require('react-router');

  return React.createClass({
    displayName: "InstanceDetailsPage",

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId)),
        instance = stores.InstanceStore.get(Number(this.getParams().instanceId)),
        helpLinks = stores.HelpLinkStore.getAll();

      if (!project || !instance || !helpLinks) {
        return <div className="loading"></div>;
      }

      return (
        <ProjectResourcesWrapper project={project}>
          <InstanceDetailsView project={project} instance={instance}/>
        </ProjectResourcesWrapper>
      );
    }

  });

});
