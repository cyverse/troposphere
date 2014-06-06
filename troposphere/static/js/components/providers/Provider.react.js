/** @jsx React.DOM */

define(
  [
    'react'
  ], function(React) {

    var Provider = React.createClass({
      render: function() {
          var provider = this.props.provider;
          return (
            <div>
              <h2>{provider.get('location')}</h2>
              <p>{provider.get('description')}</p>
            </div>
          );
      }
    });

    return Provider;
  });
