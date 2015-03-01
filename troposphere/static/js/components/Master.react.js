define(function (require) {
  "use strict";

  var React = require('react'),
      stores = require('stores'),
      Backbone = require('backbone'),
      context = require('context'),
      Header = require('./Header.react'),
      Footer = require('./Footer.react'),
      actions = require('actions');

  // Routing
  var Router = require('react-router'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    getState: function() {
        return {};
      },

      getInitialState: function() {
        return this.getState();
      },

      updateState: function() {
        if (this.isMounted()) this.setState(this.getState())
      },

      componentDidMount: function () {
        stores.ApplicationStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ApplicationStore.removeChangeListener(this.updateState);
      },

      //componentDidMount: function () {
      //  // todo: kick out for now as v2 has a different flow - refactor this later
      //  return;
      //
      //  if(context.nullProject){
      //    if(!context.nullProject.isEmpty()){
      //      actions.NullProjectActions.migrateResourcesIntoProject(context.nullProject);
      //    }else{
      //      actions.NullProjectActions.moveAttachedVolumesIntoCorrectProject();
      //    }
      //  }
      //},

    // --------------
    // Render Helpers
    // --------------

    render: function () {
      var maintenanceMessages = new Backbone.Collection();
      if(this.props.profile) {
        maintenanceMessages = stores.MaintenanceMessageStore.getAll();
      }
      var marginTop = maintenanceMessages.length * 24 + "px";

      return (
        <div>
          <Header profile={context.profile} currentRoute={["projects"]} maintenanceMessages={maintenanceMessages}/>
          <div id="main" style={{"marginTop": marginTop}}>
            <RouteHandler/>
          </div>
          <Footer profile={this.props.profile}/>
        </div>
      );
    }

  });

});