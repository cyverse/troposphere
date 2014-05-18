/** @jsx React.DOM */

define(
  [
    'react',
    'components/PageHeader.react',
    'components/mixins/loading',
    'models/instance',
    'rsvp',
    'components/common/Time.react',
    'controllers/instances',
    'url',
    'components/common/ButtonDropdown.react',
    'components/common/Glyphicon.react',
    './InstanceAttributes.react',
    './InstanceLinks.react',
    './ActionList.react'
  ],
  function (React, PageHeader, LoadingMixin, Instance, RSVP, Time, InstanceController, URL, ButtonDropdown, Glyphicon, InstanceAttributes, InstanceLinks, ActionList) {

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
