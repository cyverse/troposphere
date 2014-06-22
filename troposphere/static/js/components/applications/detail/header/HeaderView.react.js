/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

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
            <h1>{this.props.application.get('name_or_id')}</h1>
          </div>
        );
      }

    });

  });
