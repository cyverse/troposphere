
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
            <div className="t-body-2 detail-label">{this.props.label + " "}</div>
            <div className="detail-value" >{this.props.children}</div>
          </li>
        );
      }

    });

  });
