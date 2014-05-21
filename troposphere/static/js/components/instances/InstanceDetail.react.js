/** @jsx React.DOM */

define(
  [
    'react',
    './InstancePage.react'
  ],
  function (React, InstancePage) {

    return React.createClass({

      render: function () {
        if (this.props.instance && this.props.providers) {
          var providers = this.props.providers;
          var instance = this.props.instance;
          var provider = providers.get(instance.get('identity').provider);

          return (
            <InstancePage instance={this.props.instance} provider={provider}/>
          );

        } else {
          return (
            <div className='loading'></div>
          );
        }
      }

    });

  });
