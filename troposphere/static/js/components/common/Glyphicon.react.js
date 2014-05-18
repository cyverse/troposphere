/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({
      render: function () {
        return (
          <i className={'glyphicon glyphicon-' + this.props.name}/>
        );
      }
    });

  });
