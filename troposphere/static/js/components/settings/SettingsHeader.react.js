
import React from 'react';
import Backbone from 'backbone';

export default React.createClass({
    displayName: "SettingsHeader",

    propTypes: {},

    render: function () {
        return (
          <div className="secondary-nav half-height">
            <div className="container">
              <div className="project-name">
                <h1>Settings</h1>
              </div>
            </div>
          </div>
        );
    }
});
