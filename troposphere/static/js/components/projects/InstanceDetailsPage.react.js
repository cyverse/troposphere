define(function (require) {

    var React = require('react'),
        stores = require('stores'),
        ProjectResourcesWrapper = require('./detail/resources/ProjectResourcesWrapper.react'),
        InstanceDetailsView = require('./resources/instance/details/InstanceDetailsView.react'),
        Router = require('react-router');

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(this.getParams().projectId),
          instance = stores.InstanceStore.get(this.getParams().instanceId);

      if (!project || !instance) return <div className="loading"></div>;

      return (
        <ProjectResourcesWrapper project={project}>
          <InstanceDetailsView project={project} instance={instance}/>
        </ProjectResourcesWrapper>
      );
    }

  });

});
