import React from 'react';
import stores from 'stores';


let login = THEME_URL + "images/login_mainimage.png";

export default React.createClass({
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
