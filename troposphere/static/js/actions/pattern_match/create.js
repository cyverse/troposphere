
import PatternMatchConstants from "constants/PatternMatchConstants";
import PatternMatch from "models/PatternMatch";
import Utils from "../Utils";

export default {

    create: function(params) {
        if (!params.pattern)
            throw new Error("Missing pattern");
        if (!params.type)
            throw new Error("Missing type");

        var pattern = params.pattern,
            type = params.type;

        var pattern_match = new PatternMatch({
            pattern: pattern,
            type: type
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
        }).fail(function(response) {
            Utils.dispatch(PatternMatchConstants.REMOVE_PATTERN, {
                pattern_match: pattern_match
            }, {
                silent: false
            });
            Utils.displayError({
                title: "PatternMatch could not be created",
                response: response
            });
        });
        return pattern_match;
    }

};
