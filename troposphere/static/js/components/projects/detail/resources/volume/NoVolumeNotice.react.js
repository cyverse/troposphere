define(function (require) {

  var React = require('react/addons');

  return React.createClass({
    displayName: "NoVolumeNotice",

    render: function () {
      return (
        <p>
          You have not added any volumes to this project.
        </p>
      );
    }

  });

});
