define(function (require) {

  var React = require('react/addons');

  return React.createClass({
    displayName: "NoExternalLinkNotice",

    render: function () {
      return (
        <p>
          You have not added any links to this project.
        </p>
      );
    }

  });

});
