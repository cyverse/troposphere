define(function (require) {
  "use strict";

  var React = require('react/addons'),
      stores = require('stores'),
      Backbone = require('backbone'),
      context = require('context'),
      globals = require('globals'),
      Header = require('./Header.react'),
      Footer = require('./Footer.react'),
      actions = require('actions'),
      showUnsupportedModal = require('modals/unsupported/showUnsupportedModal.js'),
      modernizrTest = require('components/modals/unsupported/modernizrTest.js'),
      NullProject = require('models/NullProject');

  // Routing
  var Router = require('react-router'),
    RouteHandler = Router.RouteHandler;
  return React.createClass({
    displayName: "Master",

    mixins: [Router.State],

    getState: function () {
      return {};
    },

    getInitialState: function () {
      return this.getState();
    },

    updateState: function () {
      if (this.isMounted()) this.setState(this.getState())
    },

    closeUnsupportedModal: function () {
          var instances = stores.InstanceStore.getInstancesNotInAProject(),
          volumes = stores.VolumeStore.getVolumesNotInAProject(),
          nullProject = new NullProject({instances: instances, volumes: volumes});

          //setTimout is a Hack. We need to let the first modal unmount before calling getDOMNode
          //on the second modal, else we get an err "Invariant Violation: getDOMNode():".
          //See https://github.com/facebook/react/issues/2410 for other solutions
          setTimeout(function(){
          if (!nullProject.isEmpty()) {
              actions.NullProjectActions.migrateResourcesIntoProject(nullProject);
          } else {
              actions.NullProjectActions.moveAttachedVolumesIntoCorrectProject();
          }
          }, 1);
    },

    loadBadgeData: function(){
      stores.BadgeStore.getAll(),
      stores.MyBadgeStore.getAll(),
      stores.InstanceHistoryStore.getAllAndCheckBadges();
      stores.ImageBookmarkStore.getAllAndCheckBadges();
    },

    componentDidMount: function () {
      // subscribe to all Stores
      Object.keys(stores).forEach(function (storeName) {
        stores[storeName].addChangeListener(this.updateState);
      }.bind(this));

      // The code below is only relevant to logged in users
      if (!context.profile) return;

      // IMPORTANT! We get one shot at this. If the instances and volumes aren't
      // fetched before this component is mounted we miss our opportunity to migrate
      // the users resources (so make sure they're fetched in the Splash Screen)


        var instances = stores.InstanceStore.getInstancesNotInAProject(),
        volumes = stores.VolumeStore.getVolumesNotInAProject(),
        nullProject = new NullProject({instances: instances, volumes: volumes});
      if (!modernizrTest.unsupported()) {
          showUnsupportedModal.showModal(this.closeUnsupportedModal);
      }

      if (modernizrTest.unsupported()) {

        if (!nullProject.isEmpty()) {
            actions.NullProjectActions.migrateResourcesIntoProject(nullProject);
        } else {
            actions.NullProjectActions.moveAttachedVolumesIntoCorrectProject();
        }
      }

      if (globals.BADGES_ENABLED){
        this.loadBadgeData();
      }

    },



    componentWillUnmount: function () {
      // un-subscribe from all Stores
      Object.keys(stores).forEach(function (storeName) {
        stores[storeName].removeChangeListener(this.updateState);
      }.bind(this));
    },

    // --------------
    // Render Helpers
    // --------------

    render: function () {

      var maintenanceMessages = stores.MaintenanceMessageStore.getAll() || new Backbone.Collection(),
      marginTop = maintenanceMessages.length * 24 + "px";

      return (
        <div>
          <Header profile={context.profile} currentRoute={["projects"]} maintenanceMessages={maintenanceMessages}/>

          <div id="main" style={{"marginTop": marginTop}}>
            <RouteHandler/>
          </div>
          <Footer text={globals.SITE_FOOTER} profile={context.profile}/>
        </div>
      );
    }

  });

});
