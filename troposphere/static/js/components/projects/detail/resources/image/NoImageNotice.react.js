import React from 'react/addons';

export default React.createClass({
    displayName: "NoImageNotice",

    render: function () {
      return (
        <p>
          You have not added any images to this project.
        </p>
      );
    }
});
