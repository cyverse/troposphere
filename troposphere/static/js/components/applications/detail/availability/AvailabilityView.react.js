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
          <div className='image-availability'>
            <h2>Image available on:</h2>
            <span>OpenStack X, OpenStack Y</span>
          </div>
        );
      }

    });

  });
