/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    './InstanceAttributes.react',
    './InstanceLinks.react',
    './ActionList.react',
    'backbone'
  ],
  function (React, PageHeader, InstanceAttributes, InstanceLinks, ActionList, Backbone) {

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
            <PageHeader title={"Instance: " + instance.get('name_or_id')}/>
            <ActionList instance={instance} isOpenstack={provider.isOpenStack()}/>
            <InstanceAttributes instance={instance} provider={provider}/>
            <InstanceLinks instance={instance}/>
          </div>
        );
      }

    });

  });
