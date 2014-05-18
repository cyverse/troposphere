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

    var InstancePage = React.createClass({
      render: function () {
        var instance = this.props.instance,
          provider = this.props.provider;
        return React.DOM.div({},
          PageHeader({title: "Instance: " + instance.get('name_or_id')}),
          ActionList({instance: instance,
            isOpenstack: provider.isOpenStack()}),
          InstanceAttributes({instance: instance,
            provider: provider}),
          InstanceLinks({instance: instance}));
      }
    });

    var InstanceDetail = React.createClass({
      componentDidMount: function () {
        if (!this.props.instance)
          this.props.onRequestInstance();
        /*
         if (!this.props.providers)
         this.props.onRequestProviders();
         */
      },
      render: function () {
        if (this.props.instance && this.props.providers) {
          var providers = this.props.providers,
            instance = this.props.instance;
          var provider = providers.get(instance.get('identity').provider);
          return InstancePage({instance: this.props.instance, provider: provider});
        } else
          return React.DOM.div({className: 'loading'});
      }
    });

    return InstanceDetail;
  });
