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

      render: function () {
        return (
          <div className='image-description'>
            <h2>Image Description</h2>
            <p>{this.props.application.get('description')}</p>
          </div>
        );
      }

    });

  });
