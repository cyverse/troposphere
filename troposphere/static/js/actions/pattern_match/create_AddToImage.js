
import PatternMatchConstants from "constants/PatternMatchConstants";
import PatternMatch from "models/PatternMatch";
import actions from "actions";
import Utils from "../Utils";

export default {

    create_AddToImage: function(params) {

        if (!params.pattern)
            throw new Error("Missing pattern");
        if (!params.type)
            throw new Error("Missing type");
        if (params.allowAccess == null)
            throw new Error("Missing allowAccess");
        if (!params.image)
            throw new Error("Missing image");

        var {allowAccess, pattern, type, image, onSuccess } = params;

        var pattern_match = new PatternMatch({
            pattern: pattern,
            type: type,
            allow_access: allowAccess
        });

        // Add the pattern_match optimistically
        Utils.dispatch(PatternMatchConstants.ADD_PATTERN, {
            pattern_match: pattern_match
        }, {
            silent: false
        });

        pattern_match.save().done(function() {
            Utils.dispatch(PatternMatchConstants.UPDATE_PATTERN, {
                pattern_match: pattern_match
            }, {
                silent: false
            });
            Utils.dispatch(PatternMatchConstants.REMOVE_PENDING_PATTERN_FROM_IMAGE, {
                pattern_match: pattern_match,
                image: image
            });
            actions.ImagePatternMatchActions.add({
                image: image,
                pattern_match: pattern_match
            });
            if(onSuccess) {
                onSuccess(pattern_match);
            }
        }).fail(function(response) {
            Utils.dispatch(PatternMatchConstants.REMOVE_PATTERN, {
                pattern_match: pattern_match
            }, {
                silent: false
            });
            Utils.dispatch(PatternMatchConstants.REMOVE_PENDING_PATTERN_FROM_IMAGE, {
                pattern_match: pattern_match,
                image: image
            });
            Utils.displayError({
                title: "PatternMatch could not be created",
                response: response
            });
        });

        Utils.dispatch(PatternMatchConstants.ADD_PENDING_PATTERN_TO_IMAGE, {
            pattern_match: pattern_match,
            image: image
        });

    }

};
