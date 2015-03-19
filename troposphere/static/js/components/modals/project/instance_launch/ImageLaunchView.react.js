/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceLaunch.react'
  ],
  function (React, Backbone, InstanceLaunch) {

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onPrevious: React.PropTypes.func.isRequired,
        onNext: React.PropTypes.func.isRequired
      },

      //
      // Callbacks
      //

      onBack: function(){
        this.props.onPrevious(this.props.image);
      },

      onLaunch: function(identity, machineId, sizeId, instanceName){
        this.props.onNext(identity, machineId, sizeId, instanceName);
      },

      //
      // Render
      // ------
      //

      render: function () {
        var image = this.props.image;

        return (
          <InstanceLaunch application={image} onPrevious={this.onBack} onNext={this.onLaunch}/>
        );
      }

    });

  });
