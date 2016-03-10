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
      var profile = stores.ProfileStore.get();
      if(!context.profile && profile) {
          context.profile = profile;
      }
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
      stores.InstanceHistoryStore.fetchAndCheckBadges();
      stores.ImageBookmarkStore.getAllAndCheckBadges();
    },

    componentDidMount: function () {
      // subscribe to all Stores
      Object.keys(stores).forEach(function (storeName) {
        stores[storeName].addChangeListener(this.updateState);
      }.bind(this));

      // The code below is only relevant to logged in users
      if (!context.profile || !context.profile.get('selected_identity')) return;

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

      if (!show_public_site && !context.profile.get('selected_identity') ) {
          //Users who ARE logged in, but without an identity
          //cannot be handled in the application, currently.
          //These users are punted now.
          var username = context.profile.get('username'),
              errorText = "User <"+username+"> was authenticated, but has no available, active identities. Contact your Cloud Administrator.",
              error_status = encodeURIComponent(errorText);
          window.location = "/forbidden?banner=" + error_status;
      }

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
