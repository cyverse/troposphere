import React from "react";
import _ from "underscore";

/**
 * a listing of the available icon within the existing module can be
 * found here:
 * - http://glyphicons.bootstrapcheatsheets.com/
 */

export default React.createClass({
    displayName: "Glyphicon",

    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    render: function() {
        let passThroughProps = _.omit(this.props, "name");
        return (
        <i { ...passThroughProps } className={"glyphicon glyphicon-" + this.props.name} />
        );
    }
});
