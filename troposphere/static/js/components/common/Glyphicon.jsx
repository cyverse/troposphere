import React from "react";

/**
 * a listing of the available icon within the existing module can be
 * found here:
 * - http://glyphicons.bootstrapcheatsheets.com/
 */

export default React.createClass({
    displayName: "Glyphicon",

    render: function() {
        return (
        <i className={"glyphicon glyphicon-" + this.props.name} />
        );
    }
});
