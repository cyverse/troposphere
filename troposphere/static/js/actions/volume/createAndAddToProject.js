
import VolumeConstants from 'constants/VolumeConstants';
import Volume from 'models/Volume';
import actions from 'actions';
import globals from 'globals';
import Utils from '../Utils';
import ProjectVolume from 'models/ProjectVolume';
import ProjectVolumeConstants from 'constants/ProjectVolumeConstants';

export default {

    createAndAddToProject: function(payload) {
        if (!payload.project) throw new Error("Missing project");
        if (!payload.volumeName) throw new Error("Missing volumeName");
        if (!payload.volumeSize) throw new Error("Missing volumeSize");
        if (!payload.identity) throw new Error("Missing identity");

        var volumeName = payload.volumeName,
            project = payload.project,
            identity = payload.identity,
            volumeSize = payload.volumeSize;

        var identityUUID = identity.get('uuid'),
            providerUUID = identity.get('provider').uuid,
            url = (
                globals.API_ROOT +
                "/provider" + providerUUID +
                "/identity" + identityUUID +
                "/volume"
            );

        var volume = new Volume({
            name: volumeName,
            size: volumeSize,
            description: "",
            status: "creating",
            provider: {
                id: identity.get('provider').id,
                uuid: identity.get('provider').uuid
            },
            identity: {
                id: identity.id,
                uuid: identity.get('uuid')
            },
            projects: [project.id]
        }, {
            parse: true
        });

        var projectVolume = new ProjectVolume({
            project: project.toJSON(),
            volume: volume.toJSON()
        });

        Utils.dispatch(VolumeConstants.ADD_VOLUME, {
            volume: volume
        });

        // Add the instance to the project now, so the user can see it being requested
        Utils.dispatch(ProjectVolumeConstants.ADD_PENDING_VOLUME_TO_PROJECT, {
            volume: volume,
            project: project
        });

        volume.createOnV1Endpoint({
            name: volumeName,
            size: volumeSize
        }).done(function(attrs, status, response) {
            volume.set('id', attrs.id);
            volume.fetch().done(function() {
                // todo: remove hack and start using ProjectVolume endpoint to discover
                // which project an volume is in
                volume.set('projects', [project.id]);

                Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {
                    volume: volume
                });
                Utils.dispatch(VolumeConstants.POLL_VOLUME, {
                    volume: volume
                });

                actions.ProjectVolumeActions.addVolumeToProject({
                    project: project,
                    volume: volume
                });
            });
        }).fail(function(response) {
            Utils.dispatch(VolumeConstants.REMOVE_VOLUME, {
                volume: volume
            });
            Utils.displayError({
                title: "Volume could not be created",
                response: response
            });
        }).always(function() {
            Utils.dispatch(ProjectVolumeConstants.REMOVE_PENDING_PROJECT_VOLUME, {
                projectVolume: projectVolume
            })
        });

    }

};
