import React from "react";

/**
 * NOTE: a cheatsheet of available glyphicons can be found at:
 *   - http://glyphicons.bootstrapcheatsheets.com/
 *
 *   this becomes reference-able within the app via the
 *   `bootstrap-sass` module
 */

export default React.createClass({
    displayName: "Glyphicon",

    render: function() {
        return (
        <i className={"glyphicon glyphicon-" + this.props.name} />
        );
    }
});
