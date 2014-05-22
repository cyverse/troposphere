/** @jsx React.DOM */

define(
  [
    'react',
    './detail/InstanceDetails.react'
  ],
  function (React, InstanceDetails) {

    return React.createClass({

      render: function () {
        if (this.props.instance && this.props.providers) {
          var providers = this.props.providers;
          var instance = this.props.instance;
          var provider = providers.get(instance.get('identity').provider);

          return (
            <InstanceDetails instance={this.props.instance} provider={provider}/>
          );

        } else {
          return (
            <div className='loading'></div>
          );
        }
      }

    });

  });
