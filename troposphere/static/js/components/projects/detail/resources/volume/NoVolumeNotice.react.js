import React from 'react/addons';

export default React.createClass({
    displayName: "NoVolumeNotice",

    render: function () {
      return (
        <p>
          You have not added any volumes to this project.
        </p>
      );
    }
});
