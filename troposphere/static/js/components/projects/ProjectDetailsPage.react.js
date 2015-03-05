define(function (require) {

  var React = require('react'),
      stores = require('stores'),
      ProjectDetailsView = require('./detail/details/ProjectDetailsView.react'),
      Router = require('react-router');

  return React.createClass({

    mixins: [Router.State],

    //
    // Mounting & State
    // ----------------
    //

    getState: function() {
      return {
        project: stores.ProjectStore.get(this.getParams().projectId)
      };
    },

    getInitialState: function() {
      return this.getState();
    },

    updateState: function() {
      if (this.isMounted()) this.setState(this.getState())
    },

    componentDidMount: function () {
      stores.ProjectStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ProjectStore.removeChangeListener(this.updateState);
    },

    //
    // Render
    // ------
    //

    render: function () {
      var project = this.state.project;

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
