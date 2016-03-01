import React from 'react/addons';
import stores from 'stores';


let login = THEME_URL + "images/login_mainimage.png";

export default React.createClass({
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
              <p>
                {"You can view more information about the current maintenance on the "}
                <a href="http://atmosphere.status.io/" target="_blank">status page</a>
              </p>
            </h4>
          </h4>
        </div>

      );
    }

});
