define(function (require) {
  "use strict";

  var React = require('react/addons'),
    stores = require('stores'),
    login = THEME_URL + "/images/large_logo.png";

  return React.createClass({
    displayName: "MaintenanceScreen",

    render: function () {
      return (
        <div>
        <div className="splash-image">
          <div id="imgcontainer" className="center">
            <img src={login}/>
          </div>
        </div>
          <h4>
            <h4>
              <p>Atmosphere is currently under maintenance.</p>
            </h4>
          </h4>
        </div>

      );
    }

  });

});
