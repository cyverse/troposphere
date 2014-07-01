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
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        size: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance,
            provider = this.props.provider,
            size = this.props.size;

        return (
          <div>
            <Header/>
            <div className="row instance-details-content">
              <div className="col-md-9">
                <InstanceInfo instance={instance}/>
                <hr/>
                <InstanceDetails instance={instance} provider={provider} size={size}/>
                <hr/>
              </div>
              <div className="col-md-3">
                <InstanceActionsAndLinks instance={instance}/>
              </div>
            </div>
          </div>
        );
      }

    });

  });
