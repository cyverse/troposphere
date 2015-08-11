define(function (require) {

  var React = require('react/addons'),
      checkmark = require("images/checkmark.png");

  return React.createClass({

    propTypes: {
      isChecked: React.PropTypes.bool
    },

    render: function () {
      var className = "resource-checkbox";
      if (this.props.isChecked) {
        className += " checked";
      }
      return (
        <div className={className}>
        <img src={{ checkmark }}/>
        </div>
      );
    }

  });

});
