import React from "react";

export default React.createClass({
    displayName: "SettingsHeader",

    propTypes: {},

    render: function() {
        return (
            <div style={{paddingTop: "50px"}} className="container">
                <div className="project-name">
                    <h1 className="t-display-1">Settings</h1>
                </div>
            </div>
        );
    }
});
