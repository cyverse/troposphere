import _ from "underscore";
import React from "react";

export default React.createClass({
    displayName: "VncResolutionSelect",

    renderOption: function(res) {
        return (
        <option>
          {res}
        </option>
        );
    },

    render: function() {
        var options = [
            "1024x768",
            "1280x1024",
            "1600x1000",
            "1680x1050",
            "1920x1080",
            "3200x1200"
          ].map(this.renderOption)

        return (
        <select value={this.props.id}
            className="dropdown"
            id="resolution"
            onChange={this.props.onChange}>
            {options}
        </select>
        );
    }

});
