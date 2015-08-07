
define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      propTypes: {
        label: React.PropTypes.string.isRequired,
        children: React.PropTypes.node.isRequired
      },

      render: function () {
        return (
          <li>
            <span>{this.props.label}</span>
            <span>{this.props.children}</span>
          </li>
        );
      }

    });

  });
