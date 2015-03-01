define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      RouteHandler = Router.RouteHandler,
      stores = require('stores'),
      SecondaryProjectNavigation = require('../common/SecondaryProjectNavigation.react');

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

    render: function () {
      var project = this.state.project;

      if(!project) {
        return (
          <div className="loading"></div>
        )
      }

      return (
        <div className="project-details">
          <SecondaryProjectNavigation project={project} currentRoute="details"/>
          <RouteHandler/>
        </div>
      );
    }

  });

});