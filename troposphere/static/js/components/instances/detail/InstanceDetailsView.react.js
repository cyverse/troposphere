/** @jsx React.DOM */

define(
  [
    'react',
    './Header.react',
    './InstanceInfo.react',
    './InstanceDetails.react',
    './InstanceActionsAndLinks.react',
    'backbone'
  ],
  function (React, Header, InstanceInfo, InstanceDetails, InstanceActionsAndLinks, Backbone) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance,
            provider = this.props.provider;

        return (
          <div>
            <Header/>
            <InstanceInfo/>
            <InstanceDetails/>
            <InstanceActionsAndLinks/>
          </div>
        );
      }

    });

  });
