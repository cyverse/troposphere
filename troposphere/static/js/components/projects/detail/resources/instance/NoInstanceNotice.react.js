import React from 'react/addons';

export default React.createClass({
    displayName: "NoInstanceNotice",

    render: function () {
      return (
        <p>
          You have not added any instances to this project.
        </p>
      );
    }
});
