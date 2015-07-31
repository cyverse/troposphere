import React from "react";
import "css/no_user.scss"
import login from "images/login_mainimage.png";

class NoUser extends React.Component {
  render() {
    <div>
      <img src={login} />
      <div class="message-wrapper">
          <p>Your account does not currently have access to Atmosphere.</p>
          <p>If you would like to request access, you can do so through the <a href="https://user.iplantcollaborative.org/dashboard/">iPlant User Management Portal</a> by clicking the 'Request Access' button next to the Atmosphere service.</p>
          <p>You can also find instructions <a href="https://pods.iplantcollaborative.org/wiki/display/atmman/Requesting+Access+to+Atmosphere">in the wiki</a>.</p>
          <p>If you have already requested access, then you must wait until your request is approved before you can use Atmosphere.</p>
      </div>
    </div>
  }
}

React.render(<NoUser />, document.body);
