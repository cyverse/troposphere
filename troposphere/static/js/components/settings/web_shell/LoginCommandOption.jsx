import _ from "underscore";
import React from "react";

export default React.createClass({
    displayName: "LoginCommandOption",

    render: function() {
        return (
        <option value={this.props.type}>
            {this.props.text}
        </option>
        );
    }
});
