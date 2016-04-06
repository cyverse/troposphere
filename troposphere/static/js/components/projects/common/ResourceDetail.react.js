
define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({
      displayName: 'ResourceDetail',

      propTypes: {
        label: React.PropTypes.string.isRequired,
        children: React.PropTypes.node.isRequired
      },

      render: function () {
        return (
          <li className="clearfix">
            <span className="detail-label">{this.props.label + "** "}</span>
            <span className="detail-value" >{this.props.children}</span>
          </li>
        );
      }

    });

  });
