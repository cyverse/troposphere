/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'url'
  ],
  function (React, Backbone, URL) {

    return React.createClass({

      propTypes: {
        isChecked: React.PropTypes.bool
      },

      render: function () {
        var className = "resource-checkbox";
        if(this.props.isChecked){
          className += " checked";
        }
        return (
          <div className={className} onClick={this.props.onToggleChecked}>
            <img src="/assets/images/checkmark.png"/>
          </div>
        );
      }

    });

  });
