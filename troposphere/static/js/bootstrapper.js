define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        React = require('react'),
        SplashScreen = require('components/SplashScreen.react'),
        MaintenanceScreen = require('components/MaintenanceScreen.react');

    // Disconnect all Backbone Events from Models and Collections
    Object.keys(Backbone.Events).forEach(function(functionName){
      Backbone.Model.prototype[functionName] = function(){};
      Backbone.Collection.prototype[functionName] = function(){};
    });

    //Backbone.Model.prototype.parse = function(resp, options) {
    //  if(resp.id) resp.id = String(resp.id);
    //  return resp;
    //};

    Backbone.Collection.prototype.get = function(obj) {
      if (obj == null) return void 0;
      return _.find(this.models, function(model){
        return model.id == obj || model.id === obj.id || model.cid === obj.cid;
        //return model.id == String(obj) || model.id === String(obj.id) || model.cid === obj.cid;
      });
    };

    // Register which stores the application should use
    var stores = require('stores');
    stores.ApplicationStore        = require('stores/ApplicationStore');
    stores.IdentityStore           = require('stores/IdentityStore');
    stores.ImageBookmarkStore      = require('stores/ImageBookmarkStore');
    stores.InstanceHistoryStore    = require('stores/InstanceHistoryStore');
    stores.InstanceStore           = require('stores/InstanceStore');
    stores.InstanceTagStore        = require('stores/InstanceTagStore');
    stores.MachineStore            = require('stores/MachineStore');
    stores.MaintenanceMessageStore = require('stores/MaintenanceMessageStore');
    stores.ProfileStore            = require('stores/ProfileStore');
    stores.ProjectStore            = require('stores/ProjectStore');
    stores.ProjectInstanceStore    = require('stores/ProjectInstanceStore');
    stores.ProjectVolumeStore      = require('stores/ProjectVolumeStore');
    stores.ProviderStore           = require('stores/ProviderStore');
    stores.QuotaRequestStore       = require('stores/QuotaRequestStore');
    stores.QuotaStatusStore        = require('stores/QuotaStatusStore');
    stores.QuotaStore              = require('stores/QuotaStore');
    stores.SizeStore               = require('stores/SizeStore');
    stores.TagStore                = require('stores/TagStore');
    stores.VersionStore            = require('stores/VersionStore');
    stores.VolumeStore             = require('stores/VolumeStore');

    var actions = require('actions');
    actions.ApplicationActions     = require('actions/ApplicationActions');
    actions.HelpActions            = require('actions/HelpActions');
    actions.ImageBookmarkActions   = require('actions/ImageBookmarkActions');
    actions.InstanceActions        = require('actions/InstanceActions');
    actions.InstanceTagActions     = require('actions/InstanceTagActions');
    actions.InstanceVolumeActions  = require('actions/InstanceVolumeActions');
    actions.NullProjectActions     = require('actions/NullProjectActions');
    actions.ProfileActions         = require('actions/ProfileActions');
    actions.ProjectActions         = require('actions/ProjectActions');
    actions.ProjectInstanceActions = require('actions/ProjectInstanceActions');
    actions.ProjectVolumeActions   = require('actions/ProjectVolumeActions');
    actions.TagActions             = require('actions/TagActions');
    actions.VolumeActions          = require('actions/VolumeActions');

    var modals = require('modals');
    modals.HelpModals              = require('modals/HelpModals');
    modals.InstanceModals          = require('modals/InstanceModals');
    modals.InstanceVolumeModals    = require('modals/InstanceVolumeModals');
    modals.TagModals               = require('modals/TagModals');
    modals.VersionModals           = require('modals/VersionModals');
    modals.VolumeModals            = require('modals/VolumeModals');

    return {
      run: function () {

        // Make sure the Authorization header is added to every AJAX request
        $.ajaxSetup({
          headers: {
            "Authorization": "Token " + window.access_token,
            "Content-Type": "application/json"
          }
        });

        // We're wrapping Backbone.sync so that we can observe every AJAX request.
        // If any request returns a 503 (service unavailable) then we're going to
        // throw up the maintenance splash page. Otherwise, just pass the response
        // up to chain.
        var originalSync = Backbone.sync;
        Backbone.sync = function(attrs, textStatus, xhr){
          // NOTE: a conceptually simpler solution would be to do this:
          //
          //    var xhr = originalSync.apply(this, arguments).catch(function(response){
          //      if(response.status === 503) {
          //        $('.splash-image').remove();
          //        var MaintenanceComponent = React.createFactory(MaintenanceScreen);
          //        React.render(MaintenanceComponent(), document.getElementById('application'));
          //      }
          //    });
          //
          //    return xhr;
          //
          // However, since we're using jQuery deferred objects for the promise chain, and they
          // don't have a way to cancel promise propagation, we can end up in a scenario where we
          // display a toast with an error on the maintenance splash screen (because other error
          // handlers can still get called).  To get around that, we need to create our own promise
          // and, based on the result of the AJAX request, either manually resolve or reject it.


          var dfd = $.Deferred();

          originalSync.apply(this, arguments).then(function(){
            dfd.resolve.apply(this, arguments);
          }).fail(function(response){
            if(response.status === 503) {
              // need to make sure we remove the splash-image element is included in the HTML
              // template by default but re-apply the splash screen-class to body so that the
              // splash page displays correctly
              $('.splash-image').remove();
              $('body').addClass('splash-screen');

              // replace the current view with the
              var MaintenanceComponent = React.createFactory(MaintenanceScreen);
              React.render(MaintenanceComponent(), document.getElementById('application'));
            }else{
              dfd.reject.apply(this, arguments);
            }
          });

          return dfd.promise();
        };

        // render the splash page which will load the rest of the application
        $(document).ready(function () {
          var SplashScreenComponent = React.createFactory(SplashScreen);
          React.render(SplashScreenComponent(), document.getElementById('application'));
        });
      }
    }

  });
