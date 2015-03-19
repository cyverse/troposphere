define(function (require) {

  var React = require('react'),
      stores = require('stores'),
      ProjectDetailsView = require('./detail/details/ProjectDetailsView.react'),
      Router = require('react-router');

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      var project = stores.ProjectStore.get(Number(this.getParams().projectId));

      if(!project) {
        return (
          <div className="loading"></div>
        );
      }

      return (
        <ProjectDetailsView project={project}/>
      );
    }

  });

});
