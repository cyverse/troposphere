/** @jsx React.DOM */

define(
  [
    'react',
    './VolumeDetail.react'
  ], function (React, VolumeDetail) {

    return React.createClass({

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
