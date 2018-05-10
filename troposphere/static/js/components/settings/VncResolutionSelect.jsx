import React from "react";

export default React.createClass({
    displayName: "VncResolutionSelect",

    renderOption: function(res) {
        if (this.props.selected == res) {
            return (
            <option value={res} selected>
              {res}
            </option>
            );
        }
        return (
        <option value={res}>
          {res}
        </option>
        );
    },

    render: function() {
        var options = [
            "800x600",
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
