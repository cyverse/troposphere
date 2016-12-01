import ProjectImageConstants from "constants/ProjectImageConstants";
import ProjectImage from "models/ProjectImage";
import Utils from "./Utils";
import stores from "stores";


export default {

    // -------------------------
    // Add/Remove Project Image
    // -------------------------

    addImageToProject: function(params, options) {
        if (!params.project)
            throw new Error("Missing project");
        if (!params.image && !params.image.id)
            throw new Error("Missing image");

        var project = params.project,
            image = params.image,
            projectImage = new ProjectImage(),
            data = {
                project: project.id,
                image: image.id
            };

        projectImage.save(null, {
            attrs: data
        }).done(function() {
            Utils.dispatch(ProjectImageConstants.ADD_PROJECT_IMAGE, {
                projectImage: projectImage
            }, options);
        })
    },

    removeImageFromProject: function(params, options) {
        if (!params.project)
            throw new Error("Missing project");
        if (!params.image)
            throw new Error("Missing image");

        var project = params.project,
            image = params.image,
            projectImage = stores.ProjectImageStore.findOne({
                "project.id": project.id,
                "image.id": image.id
            });
        // NOTICE: we have seen Sentry errors showing that 'findOne'
        // has returned a false-y value, so the `destroy()` fails
        // We can do better by guarding that call.
        if (projectImage) {
            projectImage.destroy().done(function() {
                Utils.dispatch(ProjectImageConstants.REMOVE_PROJECT_IMAGE, {
                    projectImage: projectImage
                }, options);
            });
        }
    }
};
