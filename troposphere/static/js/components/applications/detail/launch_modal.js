define(
  [
    'react',
    'collections/sizes',
    'components/mixins/modal',
    'controllers/instances',
    'actions/SizeActions',
    'stores/SizeStore'
  ],
  function (React, Sizes, ModalMixin, Instances, SizeActions, SizeStore) {

    var InstanceSizeOption = React.createClass({
      canLaunch: function (size) {
        return size.get('remaining') > 0;
      },
      render: function () {
        return React.DOM.option({
          value: this.props.size.id
        }, this.props.size.formattedDetails());
      }
    });

    var InstanceSizeSelect = React.createClass({
      render: function () {
        var options = [];
        if (this.props.sizes)
          options = this.props.sizes.map(function (size) {
            return InstanceSizeOption({key: size.id, size: size});
          });
        return React.DOM.select({
          value: this.props.sizeId,
          className: 'form-control',
          id: 'size',
          onChange: this.props.onChange}, options);
      }
    });

    var IdentitySelect = React.createClass({
      renderOption: function (identity) {
        var provider_name = this.props.providers
          .get(identity.get('provider_id')).get('name');
        return React.DOM.option({value: identity.id},
            "Identity " + identity.id + " on " + provider_name);
      },
      render: function () {
        var options = this.props.identities.map(this.renderOption);
        return React.DOM.select({
          value: this.props.identityId,
          id: 'identity',
          className: 'form-control',
          onChange: this.props.onChange}, options);
      }
    });

    var MachineSelect = React.createClass({
      render: function () {
        var options = this.props.machines.map(function (machine) {
          return React.DOM.option({value: machine.id},
            machine.get('pretty_version'));
        });
        return React.DOM.select({
          value: this.props.machineId,
          id: 'machine',
          className: 'form-control',
          onChange: this.props.onChange}, options);
      }
    });

    var LaunchApplicationModal = React.createClass({
      mixins: [ModalMixin],
      getInitialState: function () {
        var defaultIdentity = this.props.identities.at(0);
        return {
          instanceName: '',
          identityId: defaultIdentity.id,
          sizeId: null,
          machineId: this.props.application.get('machines').at(0).id,
          sizes: null,
          failure: false,
          errors: null
        };
      },
      renderTitle: function () {
        return this.props.application.get('name_or_id');
      },
      fetchSizes: function (identityId) {
        var identity = this.props.identities.get(identityId);
        var providerId = identity.get('provider_id');
        var identityId = identity.id;
        var sizes = SizeStore.get(providerId, identityId);
        if (sizes)
          this.setSizes(sizes);
        else
          SizeActions.fetch(providerId, identityId);
      },
      setSizes: function (newSizes) {
        this.setState({
          sizes: newSizes,
          sizeId: newSizes.at(0).id
        });
      },
      updateSizes: function () {
        var identityId = this.state.identityId;
        var identity = this.props.identities.get(identityId);
        var providerId = identity.get('provider_id');
        var newSizes = SizeStore.get(providerId, identityId);
        this.setSizes(newSizes);
      },
      componentDidMount: function () {
        SizeStore.addChangeListener(this.updateSizes);
        this.fetchSizes(this.state.identityId);
      },
      componentDidUnmount: function () {
        SizeStore.removeChangeListener(this.updateSizes);
      },
      handleIdentityChange: function (e) {
        var identityId = e.target.value;
        this.setState({identityId: identityId});
        this.fetchSizes(identityId);
      },
      updateState: function (key, e) {
        var value = e.target.value;
        var state = {};
        state[key] = value;
        this.setState(state);
      },
      renderLaunchForm: function () {
        // provider id, identity id, machine_alias, name, size_alias, tags
        var identity = this.props.identities.get(this.state.identityId);
        return React.DOM.form({role: 'form'},
          React.DOM.div({className: 'form-group'},
            React.DOM.label({htmlFor: 'instance-name'}, "Instance Name"),
            React.DOM.input({type: 'text',
              className: 'form-control',
              id: 'instance-name',
              onChange: _.bind(this.updateState, this, 'instanceName')})),
          React.DOM.div({className: 'form-group'},
            React.DOM.label({htmlFor: 'machine'}, "Version"),
            MachineSelect({
              machineId: this.state.machineId,
              machines: this.props.application.get('machines'),
              onChange: _.bind(this.updateState, this, 'machineId')})),
          React.DOM.div({className: 'form-group'},
            React.DOM.label({htmlFor: 'identity'}, "Identity"),
            IdentitySelect({
              onChange: this.handleIdentityChange,
              identityId: this.state.identityId,
              identities: this.props.identities,
              providers: this.props.providers})),
          React.DOM.div({className: 'form-group'},
            React.DOM.label({htmlFor: 'size'}, "Instance Size"),
            InstanceSizeSelect({
              sizes: this.state.sizes,
              sizeId: this.state.sizeId,
              onChange: _.bind(this.updateState, this, 'sizeId')})));
      },
      renderLaunchUnsuccessful: function () {
        var errors = this.state.errors;
        var errorText = "Instance launch was unsuccessful";
        if (errors && errors.length)
          errorText += " due to the following errors:"
        else
          errorText += ".";

        var errorList = React.DOM.ul({}, _.map(errors, function (err) {
          return React.DOM.li({className: 'alert alert-danger'}, err);
        }));

        var supportEmail = "support@iplantcollaborative.org";

        return React.DOM.div({},
          React.DOM.p({}, errorText),
          errorList,
          React.DOM.p({},
            "If the problem persists, please email ",
            React.DOM.a({href: "mailto:" + supportEmail},
              supportEmail)));
      },
      renderBody: function () {
        if (this.state.failure)
          return this.renderLaunchUnsuccessful();
        else
          return this.renderLaunchForm();
      },
      launchInstance: function (e) {
        e.preventDefault();
        var identity = this.props.identities.get(this.state.identityId);
        this.setState({launching: true});
        Instances.launch(identity, this.state.machineId, this.state.sizeId,
          this.state.instanceName)
          .then(
          function (instance) {
            this.setState({launching: false});
            this.close();
          }.bind(this),
          function (messages) {
            this.setState({
              launching: false,
              failure: true,
              errors: messages
            });
          }.bind(this));
      },
      renderFooter: function () {
        if (this.state.failure)
          return React.DOM.button({
            className: 'btn btn-primary',
            onClick: function () {
              this.setState({
                failure: false,
                errors: null
              });
            }.bind(this),
          }, "Try again");
        else
          return React.DOM.button({type: 'submit',
              className: 'btn btn-primary',
              onClick: this.launchInstance,
              disabled: this.state.launching},
            this.state.launching ? "Launching..." : "Launch");
      }
    });

    return LaunchApplicationModal;

  });
