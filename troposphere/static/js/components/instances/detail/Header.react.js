/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      render: function () {
        return (
          <div>
            <a className='nav-back btn btn-default'>
              <span className='glyphicon glyphicon-arrow-left'>{''}</span>
            </a>
            <h1>Instances</h1>
          </div>
        );
      }

    });

  });
