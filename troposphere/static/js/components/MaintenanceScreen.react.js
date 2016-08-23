import React from 'react';
import globals from 'globals';

let login = globals.THEME_URL + "images/login_mainimage.png";

export default React.createClass({
    displayName: "MaintenanceScreen",

    render: function () {
        var statusPageEl,
            imageParentStyle = {
                'display': 'block',
                'margin': 'auto',
                'padding-top': '50px'
            };

        if (globals.STATUS_PAGE_LINK) {
            // if the hyperlink is part of global metdata,
            // then build out the markup element for including it
            statusPageEl = (
                <p>
                    {"You can view more information about the current maintenance on the "}
                    <a href={globals.STATUS_PAGE_LINK}
                        target="_blank">status page</a>
                </p>
            );
        }

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
