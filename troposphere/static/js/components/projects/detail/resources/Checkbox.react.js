import React from 'react';
import checkmark from 'images/checkmark.png';

export default React.createClass({
    displayName: "Checkbox",

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
        <img src={checkmark}/>
        </div>
      );
    }
});
