define(function (require) {

  var React = require('react');

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
          <img src="/assets/images/checkmark.png"/>
        </div>
      );
    }

  });

});
