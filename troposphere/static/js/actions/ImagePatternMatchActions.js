import ImagePatternMatchConstants from "constants/ImagePatternMatchConstants";
import ImagePatternMatch from "models/ImagePatternMatch";
import Utils from "./Utils";
import stores from "stores";

export default {

    add: function(params) {
        if (!params.image)
            throw new Error("Missing image");
        if (!params.pattern_match)
            throw new Error("Missing pattern_match");

        var image = params.image,
            pattern_match = params.pattern_match,
            imagePatternMatch = new ImagePatternMatch(),
            data = {
                image: image.id,
                match: pattern_match.id
            };

        imagePatternMatch.save(null, {
            attrs: data
        }).done(function() {
            Utils.dispatch(ImagePatternMatchConstants.ADD_IMAGE_PATTERN_MATCH, {
                imagePatternMatch: imagePatternMatch
            });
        }).fail(function(response) {
            Utils.displayError({
                title: "PatternMatch could not be added to Image",
                response: response
            });
        });
    },

    remove: function(params) {
        if (!params.image)
            throw new Error("Missing image");
        if (!params.pattern_match)
            throw new Error("Missing pattern_match");

        var image = params.image,
            pattern_match = params.pattern_match,
            imagePatternMatch = stores.ImagePatternMatchStore.findOne({
                "image.id": image.id,
                "pattern_match.id": pattern_match.id
            });

        imagePatternMatch.destroy().done(function() {
            Utils.dispatch(ImagePatternMatchConstants.REMOVE_IMAGE_PATTERN_MATCH, {
                imagePatternMatch: imagePatternMatch
            });
        }).fail(function(response) {
            Utils.displayError({
                title: "PatternMatch could not be removed from Image",
                response: response
            });
        });
    }

};
