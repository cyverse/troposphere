import React from 'react/addons';

export default React.createClass({
    displayName: "NoExternalLinkNotice",

    render: function () {
      return (
        <p>
          You have not added any links to this project.
        </p>
      );
    }
});
