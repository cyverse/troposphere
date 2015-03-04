define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'constants/VolumeConstants',
    'constants/ProjectVolumeConstants',
    'controllers/NotificationController',
    'models/Volume',
    'models/VolumeState',
    'actions/ProjectVolumeActions',
    'components/notifications/VolumeAttachNotifications.react',
    'stores',
    'globals',

    // Modals
    'components/modals/ModalHelpers',
    'components/modals/volume/VolumeAttachRulesModal.react',
    'components/modals/volume/VolumeAttachModal.react',
    'components/modals/volume/VolumeDetachModal.react',
    'components/modals/volume/VolumeDeleteModal.react',
    'components/modals/volume/VolumeCreateModal.react',
    'components/modals/volume/VolumeReportModal.react',
    'components/modals/volume/ExplainVolumeDeleteConditionsModal.react',

    './Utils'
  ],
  function (React, AppDispatcher, VolumeConstants, ProjectVolumeConstants, NotificationController, Volume, VolumeState, ProjectVolumeActions, VolumeAttachNotifications, stores, globals, ModalHelpers, VolumeAttachRulesModal, VolumeAttachModal, VolumeDetachModal, VolumeDeleteModal, VolumeCreateModal, VolumeReportModal, ExplainVolumeDeleteConditionsModal, Utils) {

    return {

      // ------------------------
      // Standard CRUD Operations
      // ------------------------

      updateVolumeAttributes: function (volume, newAttributes) {
        var that = this;

        volume.set(newAttributes);
        Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

        volume.save({
          name: volume.get('name')
        },{
          patch: true
        }).done(function(){
          //NotificationController.success(null, "Volume name updated");
          Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
        }).fail(function(response){
          var title = "Error updating Volume " + volume.get('name');
          if(response && response.responseJSON && response.responseJSON.errors){
              var errors = response.responseJSON.errors;
              var error = errors[0];
              NotificationController.error(title, error.message);
           }else{
              NotificationController.error(title, "If the problem persists, please let support at support@iplantcollaborative.org.");
           }
        });
      },

      attach: function(volume, project){
        var that = this,
            instances = stores.InstanceStore.getInstancesInProject(project),
            InstanceCollection = instances.constructor;

        // Filter out instances not in the same provider as the volume
        instances = instances.filter(function(i){
          return i.get('identity').provider === volume.get('identity').provider;
        });
        instances = new InstanceCollection(instances);

        if(instances.length === 0){

          var modal = VolumeAttachRulesModal({
            backdrop: 'static'
          });

          ModalHelpers.renderModal(modal, function(){});

        }else{

          var modal = VolumeAttachModal({
            volume: volume,
            project: project
          });

          ModalHelpers.renderModal(modal, function (instance, mountLocation) {
            var volumeState = new VolumeState({status_raw: "attaching"});
            volume.set({state: volumeState});
            Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

            volume.attachTo(instance, mountLocation, {
              success: function () {
                //NotificationController.success(null, VolumeAttachNotifications.success());
                Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
                Utils.dispatch(VolumeConstants.POLL_VOLUME_WITH_DELAY, {volume: volume});
              },
              error: function (responseJSON) {
                var errorCode = responseJSON.errors[0].code,
                    errorMessage = responseJSON.errors[0].message,
                    message,
                    title = "Error attaching volume";

                if(errorCode === 409){
                  message = VolumeAttachNotifications.attachError(volume, instance);
                  NotificationController.error(title, message);
                }else{
                  message = VolumeAttachNotifications.error();
                  NotificationController.error(title, message);
                }

                Utils.dispatch(VolumeConstants.POLL_VOLUME, {volume: volume});
              }
            });
          })
        }
      },

      detach: function (volume) {
        var that = this;

        var modal = VolumeDetachModal({
          volume: volume
        });

        ModalHelpers.renderModal(modal, function () {
          var volumeState = new VolumeState({status_raw: "detaching"});
          volume.set({state: volumeState});
          Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

          volume.detach({
            success: function (model) {
              //NotificationController.success(null, "Volume was detached.  It is now available to attach to another instance or destroy.");
              volume.set('state', volumeState);
              Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
              Utils.dispatch(VolumeConstants.POLL_VOLUME_WITH_DELAY, {volume: volume});
            },
            error: function (message, response) {
              var title = "Error detaching Volume " + volume.get('name');
              if(response && response.responseJSON && response.responseJSON.errors){
                  var errors = response.responseJSON.errors;
                  var error = errors[0];
                  NotificationController.error(title, error.message);
               }else{
                  NotificationController.error(title, "If the problem persists, please let support at support@iplantcollaborative.org.");
               }
            }
          });
        })


      },

      _destroy: function(payload, options){
        var volume = payload.volume;
        var project = payload.project;
        var that = this;

        // todo: change volume state to show that it's being destroyed
        var volumeState = new VolumeState({status_raw: "deleting"});
        volume.set({state: volumeState});
        Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});

        volume.destroy().done(function () {
          //NotificationController.success(null, 'Volume destroyed');

          Utils.dispatch(VolumeConstants.REMOVE_VOLUME, {volume: volume});

          // todo: the proper thing to do is to poll until the volume is actually destroyed
          // and THEN remove it from the project. Need to add a callback to support that.
          // VolumeStore.pollUntilFinalState(volume);
          ProjectVolumeActions.removeVolumeFromProject(volume, project);

        }).fail(function (response) {
          var title = "Error deleting Volume " + volume.get('name');
          if(response && response.responseJSON && response.responseJSON.errors){
              var errors = response.responseJSON.errors;
              var error = errors[0];
              NotificationController.error(title, error.message);
           }else{
              NotificationController.error(title, "If the problem persists, please let support at support@iplantcollaborative.org.");
           }
        });
      },

      destroy: function(payload, options){
        var volume = payload.volume;
        var redirectUrl = payload.redirectUrl;
        var that = this;
        var modal;
        var isAttached = volume.get('attach_data') && volume.get('attach_data').instance_id;

        if(isAttached){
          modal = ExplainVolumeDeleteConditionsModal({
            volume: volume,
            instance: stores.InstanceStore.getInstanceInProject(
              payload.project,
              volume.get('attach_data').instance_id
            )
          });
        }else{
          modal = VolumeDeleteModal({
            volume: volume
          });
        }

        ModalHelpers.renderModal(modal, function () {
          if(isAttached) return;
          that._destroy(payload, options);
          if(redirectUrl) Backbone.history.navigate(redirectUrl, {trigger: true});
        })
      },

      destroy_noModal: function(payload, options){
        this._destroy(payload, options);
      },

      createAndAddToProject: function(payload){
        var project = payload.project;
        var that = this;

        var modal = VolumeCreateModal();

        ModalHelpers.renderModal(modal, function (volumeName, volumeSize, identity) {
          var volume = new Volume({
            identity: {
              id: identity.id,
              provider: identity.get('provider').id
            },
            name: volumeName,
            description: "",
            size: volumeSize,
            status: "creating"
          }, {parse: true});

          var params = {
            model_name: "volume",
            tags: "CF++"
          };

          Utils.dispatch(VolumeConstants.ADD_VOLUME, {volume: volume});
          Utils.dispatch(ProjectVolumeConstants.ADD_PENDING_VOLUME_TO_PROJECT, {
            volume: volume,
            project: project
          });

          volume.save(params).done(function () {
            //NotificationController.success(null, 'Volume created');
            Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {volume: volume});
            Utils.dispatch(VolumeConstants.POLL_VOLUME, {volume: volume});
            Utils.dispatch(ProjectVolumeConstants.REMOVE_PENDING_VOLUME_FROM_PROJECT, {
              volume: volume,
              project: project
            });
            ProjectVolumeActions.addVolumeToProject(volume, project);
            //pollUntilBuildIsFinished(volume);
          }).fail(function (response) {
            var title = "Error creating Volume " + volume.get('name');
            if(response && response.responseJSON && response.responseJSON.errors){
                var errors = response.responseJSON.errors;
                var error = errors[0];
                NotificationController.error(title, error.message);
             }else{
                NotificationController.error(title, "If the problem persists, please let support at support@iplantcollaborative.org.");
             }

            Utils.dispatch(VolumeConstants.REMOVE_VOLUME, {volume: volume});
            Utils.dispatch(ProjectVolumeConstants.REMOVE_PENDING_VOLUME_FROM_PROJECT, {
              volume: volume,
              project: project
            });
          });
        })

      },

      reportVolume: function(volume){
        var that = this;

        var modal = VolumeReportModal({
          volume: volume
        });

        ModalHelpers.renderModal(modal, function (reportInfo) {
          var profile = stores.ProfileStore.get(),
              username = profile.get('username'),
              reportUrl = globals.API_ROOT + "/email/support" + globals.slash(),
              problemText = "",
              reportData = {};

          if(reportInfo.problems){
            _.each(reportInfo.problems, function(problem){
              problemText = problemText + "  -" + problem + "\n";
            })
          }

          reportData = {
            username: username,
            message: "Volume ID: " + volume.id + "\n" +
                     "Provider ID: " + volume.get('identity').provider + "\n" +
                     "\n" +
                     "Problems" + "\n" +
                     problemText + "\n" +
                     "Details \n" +
                     reportInfo.details + "\n",
            subject: "Atmosphere Volume Report from " + username
          };

          $.ajax({
            url: reportUrl,
            type: 'POST',
            data: JSON.stringify(reportData),
            dataType: 'json',
            contentType: 'application/json',
            success: function (model) {
              NotificationController.info(null, "Your volume report has been sent to support.");
            },
            error: function (response, status, error) {
              NotificationController.error(null, "Your volume report could not be sent to support");
            }
          });
        })
      }

    };

  });
