/** @jsx React.DOM */

define(
  [
    'react',
    './VolumeDetail.react'
  ], function (React, VolumeDetail) {

    return React.createClass({

      componentDidMount: function () {
        if (!this.props.volume) this.props.onRequestVolume();
      },

      render: function () {
        if (this.props.volume) {
          return (
            <VolumeDetail volume={this.props.volume} providers={this.props.providers}/>
          );
        } else {
          return (
            <div className='loading'></div>
          );
        }
      }

    });

  });
