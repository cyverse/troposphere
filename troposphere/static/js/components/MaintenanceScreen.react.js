define(function (require) {
  "use strict";

  var React = require('react/addons'),
    stores = require('stores'),
    login = THEME_URL + "/images/large_logo.png";

  return React.createClass({
    displayName: "MaintenanceScreen",

    render: function () {
        var imageParentStyle = {
            'display': 'block',
            'margin': 'auto',
            'padding-top': '50px'
        };
        var statusPageEl = (
            <p>
                {"You can view more information about the current maintenance on the "}
                <a href="http://atmosphere.status.io/" target="_blank">status page</a>
            </p>
        );
        return (
        <div>
            <div style={imageParentStyle}>
              <div id="imgcontainer" className="center">
                <img src={login} />
              </div>
            </div>
            <h4>
                <h4>
                    <p>Atmosphere is currently under maintenance.</p>
                    {statusPageEl}
                </h4>
            </h4>
        </div>
        );
    }

  });

});
