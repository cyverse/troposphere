import React from "react";


export default React.createClass({
    displayName: "IdentitiesMaster",

    render: function() {
        // cannot return just {this.props.x}
        return (this.props.children);
    }

});
