/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      onReturnToPreviousPage: function(e){
        e.preventDefault();
        alert("Navigating back to the previous page not yet implemented.");
      },

      render: function () {
        return (
          <div className='image-header'>
            <a className='nav-back btn btn-default' onClick={this.onReturnToPreviousPage}>
              <span className='glyphicon glyphicon-arrow-left'>{''}</span>
            </a>
            <h1>Instances</h1>
          </div>
        );
      }

    });

  });
