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
    './InstanceAttributes.react'
  ],
  function (React, PageHeader, LoadingMixin, Instance, RSVP, Time, InstanceController, URL, ButtonDropdown, Glyphicon, InstanceAttributes) {

    var InstanceLinks = React.createClass({
      renderLink: function (text, url) {
        return React.DOM.li({},
          React.DOM.a({href: url,
            target: '_blank',
            className: 'new-window'}, text));
      },
      render: function () {
        var instance = this.props.instance;
        return React.DOM.div({},
          React.DOM.h2({}, "Links"),
          React.DOM.ul({},
            this.renderLink("Web Shell", instance.get('shell_url')),
            this.renderLink("Remote Desktop", instance.get('vnc_url'))));
      }
    });

    var ActionList = React.createClass({
      renderButton: function (text, onClick, disabled) {
        return React.DOM.button({className: 'btn btn-default',
            onClick: onClick,
            disabled: disabled},
          text);
      },
      renderStartStopButton: function () {
        if (!this.props.isOpenstack)
          return null;

        if (this.props.instance.get('status') == 'shutoff')
          return this.renderButton([Glyphicon({name: 'share-alt'}), " Start"],
            InstanceController.start.bind(null, this.props.instance));
        else
          return this.renderButton([Glyphicon({name: 'stop'}), " Stop"],
            InstanceController.stop.bind(null, this.props.instance));
      },
      renderSuspendButton: function () {
        if (!this.props.isOpenstack)
          return null;

        var disabled = !this.props.instance.get('is_active');

        if (this.props.instance.get('status') == 'suspended')
          return this.renderButton([Glyphicon({name: 'play'}), ' Resume'],
            InstanceController.resume.bind(null, this.props.instance));
        else
          return this.renderButton([Glyphicon({name: 'pause'}), ' Suspend'],
            InstanceController.suspend.bind(null, this.props.instance),
            disabled);
      },
      renderRebootButton: function () {
        var disabled = !this.props.instance.get('is_active');
        var items = [React.DOM.li({}, React.DOM.a({}, "Soft reboot"))];
        if (this.props.isOpenstack)
          items.push(React.DOM.li({}, React.DOM.a({}, "Hard reboot")));

        return ButtonDropdown({buttonContent: [Glyphicon({name: 'repeat'}), " Reboot"],
          disabled: disabled}, items);
      },
      renderTerminateButton: function () {
        var handleClick = InstanceController.terminate.bind(null, this.props.instance);
        return this.renderButton([Glyphicon({name: 'remove'}), " Terminate"], handleClick);
      },
      renderResizeButton: function () {
        if (!this.props.isOpenstack)
          return null;

        var disabled = !this.props.instance.get('is_active') || this.props.instance.get('is_resize');
        return this.renderButton([Glyphicon({name: 'resize-full'}), " Resize"], null, disabled);
      },
      renderImageRequestButton: function () {
        var disabled = !this.props.instance.get('is_active');
        return this.renderButton([Glyphicon({name: 'camera'}), " Image"], null, disabled);
      },
      renderReportButton: function () {
        var disabled = !this.props.instance.get('is_active');
        var onClick = function () {
          var url = URL.reportInstance(this.props.instance);
          Backbone.history.navigate(url, {trigger: true});
        }.bind(this);
        return this.renderButton([Glyphicon({name: 'inbox'}), " Report"], onClick, disabled);
      },
      render: function () {
        return React.DOM.div({},
          React.DOM.h2({}, "Actions"),
          React.DOM.div({},
            this.renderStartStopButton(), // OS only
            this.renderSuspendButton(), // OS only
            this.renderRebootButton(),
            this.renderTerminateButton(),
            this.renderResizeButton(), // OS only
            this.renderImageRequestButton(),
            this.renderReportButton()));
      }
    });

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
