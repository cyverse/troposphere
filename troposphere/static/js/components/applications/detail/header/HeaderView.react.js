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

        // todo: add the project button back in when we support adding images to projects
        var addToProjectButton = (
          <button className="btn">
            <i className='glyphicon glyphicon-plus'></i>
            Add to Project
          </button>
        );

        return (
          <div className='image-header'>
            <a className='nav-back btn btn-default' onClick={this.onReturnToPreviousPage}>
              <span className='glyphicon glyphicon-arrow-left'>{''}</span>
            </a>
            <h1>{this.props.application.get('name_or_id')}</h1>
            {false ? addToProjectButton : null}
          </div>
        );
      }

    });

  });
