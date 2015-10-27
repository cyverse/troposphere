define(function (require) {

  var React = require('react/addons');

  return React.createClass({
    displayName: "NoInstanceNotice",

    render: function () {
      return (
        <p>
          You have not added any instances to this project.
        </p>
      );
    }

  });

});
