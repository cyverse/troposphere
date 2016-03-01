define(function (require) {

  var React = require('react');

  return React.createClass({
    displayName: "NoImageNotice",

    render: function () {
      return (
        <p>
          You have not added any images to this project.
        </p>
      );
    }

  });

});
