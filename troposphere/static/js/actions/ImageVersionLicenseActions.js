import ImageVersionLicenseConstants from "constants/ImageVersionLicenseConstants";
import ImageVersionLicense from "models/ImageVersionLicense";
import Utils from "./Utils";
import stores from "stores";

export default {

    add: function(params) {
        if (!params.image_version)
            throw new Error("Missing image_version");
        if (!params.license)
            throw new Error("Missing license");

        var image_version = params.image_version,
            license = params.license,
            imageVersionLicense = new ImageVersionLicense(),
            data = {
                image_version: image_version.id,
                license: license.get("uuid")
            };

        imageVersionLicense.save(null, {
            attrs: data
        }).done(function() {
            Utils.dispatch(ImageVersionLicenseConstants.ADD_IMAGEVERSION_LICENSE, {
                image_versionLicense: imageVersionLicense
            });
        }).fail(function(response) {
            Utils.displayError({
                title: "License could not be added to ImageVersion",
                response: response
            });
        });
    },

    remove: function(params) {
        if (!params.image_version)
            throw new Error("Missing image_version");
        if (!params.license)
            throw new Error("Missing license");

        var image_version = params.image_version,
            license = params.license,
            imageVersionLicense = stores.ImageVersionLicenseStore.findOne({
                "image_version.id": image_version.id,
                "license.id": license.id
            });

        imageVersionLicense.destroy().done(function() {
            Utils.dispatch(ImageVersionLicenseConstants.REMOVE_IMAGEVERSION_LICENSE, {
                image_versionLicense: imageVersionLicense
            });
        }).fail(function(response) {
            Utils.displayError({
                title: "License could not be removed from ImageVersion",
                response: response
            });
        });
    }

};
