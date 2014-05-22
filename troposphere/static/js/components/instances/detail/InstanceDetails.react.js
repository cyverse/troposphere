/** @jsx React.DOM */

define(
  [
    'react',
    'components/PageHeader.react',
    './InstanceAttributes.react',
    './InstanceLinks.react',
    './ActionList.react'
  ],
  function (React, PageHeader, InstanceAttributes, InstanceLinks, ActionList) {

    return React.createClass({

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
