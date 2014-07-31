/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    'bootstrap'
  ],
  function (React, _, Bootstrap) {

    return React.createClass({
      render: function () {
        var actions = _.map(this.props.actions, function (callback, text) {
          return (
            <li key={text}>
              <a href='#' onClick={callback}>{text}</a>
            </li>
          );
        });

        return (
          <div className='btn-group'>
            <button type='button' className='btn btn-default dropdown-toggle' data-toggle='dropdown'>
              {this.props.text}
              <span>{" "}</span>
              <span className='caret'></span>
            </button>
            <ul className='dropdown-menu' role='menu'>
              {actions}
            </ul>
          </div>
        );
      }
    });

  });
