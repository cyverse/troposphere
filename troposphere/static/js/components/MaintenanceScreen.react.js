define(function (require) {
  "use strict";

  var React = require('react'),
      stores = require('stores');

  return React.createClass({

    render: function () {
      return (
        <div className="splash-image">
          <img src="/assets/images/login_mainimage.png"/>
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

});