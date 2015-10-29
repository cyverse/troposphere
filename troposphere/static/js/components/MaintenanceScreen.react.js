import React from 'react/addons';
import stores from 'stores';
import login from 'images/login_mainimage.png';

export default React.createClass({
    displayName: "MaintenanceScreen",

    render: function () {
      return (
        <div className="splash-image">
          <img src={login}/>
          <h4 style={{marginTop: "-100px"}}>
            <h4 style={{marginTop: "-100px"}}>
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
