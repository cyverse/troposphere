/** @jsx React.DOM */

define(
  [
    'react',
    'controllers/VolumeController'
  ],
  function (React, VolumeController) {

    return React.createClass({

      handleClick: function (e) {
        e.preventDefault();
        VolumeController.destroy(this.props.volume);
      },

      render: function () {
        return (
          <button className='btn btn-default' onClick={this.handleClick}>
            Destroy Volume
          </button>
        );
      }

    });

  });
