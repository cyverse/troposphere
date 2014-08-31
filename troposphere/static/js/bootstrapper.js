define(function (require) {
    'use strict';

    var $ = require('jquery');
    var React = require('react');
    var SplashScreen = require('components/SplashScreen.react');

    // Register which stores the application should use
    var stores = require('stores');
    stores.ApplicationStore        = require('stores/ApplicationStore');
    stores.IdentityStore           = require('stores/IdentityStore');
    stores.InstanceHistoryStore    = require('stores/InstanceHistoryStore');
    stores.InstanceStore           = require('stores/InstanceStore');
    stores.MachineStore            = require('stores/MachineStore');
    stores.MaintenanceMessageStore = require('stores/MaintenanceMessageStore');
    stores.NullProjectStore        = require('stores/NullProjectStore');
    stores.ProfileStore            = require('stores/ProfileStore');
    stores.ProjectStore            = require('stores/ProjectStore');
    stores.ProviderStore           = require('stores/ProviderStore');
    stores.SizeStore               = require('stores/SizeStore');
    stores.TagStore                = require('stores/TagStore');
    stores.VersionStore            = require('stores/VersionStore');
    stores.VolumeStore             = require('stores/VolumeStore');

    return {
      run: function () {

        $.ajaxSetup({
          headers: {
            "Authorization": "Token " + window.access_token,
            "Content-Type": "application/json"
          }
        });

        $(document).ready(function () {
          React.renderComponent(SplashScreen(), document.getElementById('application'));
        });
      }
    }

  });
