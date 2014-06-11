/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/modal',
    'controllers/InstanceController',
    'actions/SizeActions',
    'stores/SizeStore'
  ],
  function (React, ModalMixin, InstanceController, SizeActions, SizeStore) {

    var InstanceSizeOption = React.createClass({
      canLaunch: function (size) {
        return size.get('remaining') > 0;
      },

      render: function () {
        return (
          <option value={this.props.size.id}>
            {this.props.size.formattedDetails()}
          </option>
        );
      }
    });

    var InstanceSizeSelect = React.createClass({
      render: function () {
        var options = [];
        if (this.props.sizes) {
          options = this.props.sizes.map(function (size) {
            return (
              <InstanceSizeOption key={size.id} size={size}/>
            );
          });
        }

        return (
          <select value={this.props.sizeId} className='form-control' id='size' onChange={this.props.onChange}>
            {options}
          </select>
        );
      }
    });

    var IdentitySelect = React.createClass({
      renderOption: function (identity) {
        var providerId = identity.get('provider_id')
        var provider = this.props.providers.get(providerId);
        var provider_name = provider.get('name');
        return (
          <option value={identity.id}>
            {"Identity " + identity.id + " on " + provider_name}
          </option>
        );
      },

      render: function () {
        var options = this.props.identities.map(this.renderOption);
        return (
          <select value={this.props.identityId} id='identity' className='form-control' onChange={this.props.onChange}>
            {options}
          </select>
        );
      }
    });

    var MachineSelect = React.createClass({
      render: function () {
        var options = this.props.machines.map(function (machine) {
          return (
            <option value={machine.id}>
              {machine.get('pretty_version')}
            </option>
          );
        });

        return (
          <select value={this.props.machineId} id='machine' className='form-control' onChange={this.props.onChange}>
            {options}
          </select>
        );
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
        if (sizes) {
          this.setSizes(sizes);
        } else {
          SizeActions.fetch(providerId, identityId);
        }
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
        return (
          <form role='form'>
            <div className='form-group'>
              <label htmlFor='instance-name'>Instance Name</label>
              <input type='text' className='form-control' id='instance-name' onChange={_.bind(this.updateState, this, 'instanceName')}/>
            </div>
            <div className='form-group'>
              <label htmlFor='machine'>Version</label>
              <MachineSelect machineId={this.state.machineId}
                             machines={this.props.application.get('machines')}
                             onChange={_.bind(this.updateState, this, 'machineId')}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='identity'>Identity</label>
              <IdentitySelect
                  onChange={this.handleIdentityChange}
                  identityId={this.state.identityId}
                  identities={this.props.identities}
                  providers={this.props.providers}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='size'>Instance Size</label>
              <InstanceSizeSelect
                  sizes={this.state.sizes}
                  sizeId={this.state.sizeId}
                  onChange={_.bind(this.updateState, this, 'sizeId')}
              />
            </div>
          </form>
        );
      },

      renderLaunchUnsuccessful: function () {
        var errors = this.state.errors;
        var errorText = "Instance launch was unsuccessful";
        if (errors && errors.length) {
          errorText += " due to the following errors:"
        } else {
          errorText += ".";
        }

        var errors = _.map(errors, function (err) {
          return (
            <li className='alert alert-danger'>{err}</li>
          );
        });

        var errorList = (
          <ul>{errors}</ul>
        );

        var supportEmail = "support@iplantcollaborative.org";

        return (
          <div>
            <p>{errorText}</p>
            {errorList}
            <p>
              {"If the problem persists, please email "}
              <a href={"mailto:" + supportEmail}>
                {supportEmail}
              </a>
            </p>
          </div>
        );
      },

      renderBody: function () {
        if (this.state.failure) {
          return this.renderLaunchUnsuccessful();
        } else {
          return this.renderLaunchForm();
        }
      },

      launchInstance: function (e) {
        e.preventDefault();
        var identity = this.props.identities.get(this.state.identityId);
        this.setState({launching: true});
        InstanceController.launch(identity, this.state.machineId, this.state.sizeId, this.state.instanceName)
          .then(
            // success
            function (instance) {
              this.setState({launching: false});
              this.close();
            }.bind(this),

            // failure
            function (messages) {
              this.setState({
                launching: false,
                failure: true,
                errors: messages
              });
            }.bind(this)
          );
      },

      renderFooter: function () {
        var onClick = function () {
          this.setState({
            failure: false,
            errors: null
          });
        }.bind(this);

        if (this.state.failure) {
          return (
            <button className='btn btn-primary' onClick={onClick}>
              Try again
            </button>
          );
        } else {
          return (
            <button type='submit' className='btn btn-primary' onClick={this.launchInstance} disabled={this.state.launching}>
              {this.state.launching ? "Launching..." : "Launch"}
            </button>
          );
        }
      }
    });

    return LaunchApplicationModal;

  });
