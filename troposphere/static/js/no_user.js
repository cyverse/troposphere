import React from "react";
import "css/no_user.scss";

var login = THEME_URL + "/images/login_mainimage.png";

var NoUser = React.createClass({
    render: function() {
    return (
      <div>
        <img src={login} />
        <div class="message-wrapper">
        <p>Your account does not currently have access to Atmosphere.</p>


        <p>The Jetstream User Guide is available from the <a href="http://jetstream-cloud.org/training.php">Training</a> page! Please note that updates may happen daily or even multiple times per day during early operations. This is a work in progress and at the moment the best source for understanding how you really use Jetstream</p>

        <p>If you already have an allocation, we'll be in touch soon with your access details and information on getting started. If you are interested in getting access to Jetstream and finding out about it’s capabilities first hand, please visit <a href="https://portal.xsede.org/allocations-overview#types-startup">https://portal.xsede.org/allocations-overview#types-startup</a> and review the allocations information and process there.</p>

        <p>You can request an allocation through the XSEDE User Portal. For more information, visit the <a href="http://jetstream-cloud.org/allocations.php">Request Allocation</a> page.</p>

        <p>Jetstream is a first of a kind cloud system funded by the NSF; a qualitatively new type of resource for interactive cloud computing - focused on scientists working in “the long tail of science.” For further help, email <a href="mailto:%20jetstream%40tickets.xsede.org">jetstream@tickets.xsede.org</a>.</p>

        <p>If you have already requested access, then you must wait until your request is approved before you can use Atmosphere.</p>

        <p>If you have already been approved, you may be seeing this page because your session has expired. Click below to attempt another login.</p>
        <a className="submitButton" href="/logout?force=true">
            Attempt to Login Again
        </a>
        </div>
      </div>
    );
  }
});

React.render(<NoUser />, document.body);
