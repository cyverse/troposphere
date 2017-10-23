import React from "react";
import ChosenSingleMixinExternal from "components/mixins/ChosenSingleMixinExternal";

export default React.createClass({
    displayName: "ChosenSingleDropdown",

    mixins: [ChosenSingleMixinExternal],

    getNoResultsPhrase: function(query) {
        return (
        <span style={{ whiteSpace: "pre" }}>
            { `No matches found for "${query}".` }
        </span>
        );
    },

    getNoDataPhrase: function() {
        return "No data found in list.";
    },

})

