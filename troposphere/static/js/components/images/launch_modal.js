define(['react', 'singletons/providers',
'collections/sizes', 'components/mixins/modal',
'controllers/providers'], function(React, providers, Sizes,
ModalMixin, ProviderController) {

    var InstanceSizeSelect = React.createClass({
        getInitialState: function() {
            return {
                sizes: null
            };
        },
        updateSizes: function(providerId, identityId) {
            ProviderController.getSizeCollection(providerId, identityId)
                .then(function(newSizes) {
                    this.setState({sizes: newSizes});
                }.bind(this));
        },
        componentDidMount: function() {
            this.updateSizes(this.props.providerId, this.props.identityId);
        },
        componentWillReceiveProps: function(newProps) {
            this.updateSizes(newProps.providerId, newProps.identityId);
        },
        renderOptionText: function(size) {
            return size.get('name');
        },
        render: function() {
            var options = [];
            if (this.state.sizes)
                options = this.state.sizes.map(function(size) {
                    return React.DOM.option({
                        value: size.id
                    }, this.renderOptionText(size));
            }.bind(this));
            return React.DOM.select({
                value: this.props.sizeId,
                className: 'form-control',
                id: 'size',
                onChange: this.props.onChange}, options);
        }
    });

    var IdentitySelect = React.createClass({
        render: function() {
            var options = this.props.identities.map(function(identity) {
                var provider_name = providers.get(identity.get('provider_id')).get('name');
                return React.DOM.option({value: identity.id},
                    "Identity " + identity.id + " on " + provider_name);
            });
            return React.DOM.select({
                value: this.props.identityId,
                id: 'identity',
                className: 'form-control',
                onChange: this.props.onChange}, options);
        }
    });

    var MachineSelect = React.createClass({
        render: function() {
            var options = this.props.machines.map(function(machine) {
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
        getInitialState: function() {
            var defaultIdentity = this.props.identities.at(0);
            return {
                instanceName: '',
                identityId: defaultIdentity.id,
                sizeId: null,
                machineId: this.props.application.get('machines').at(0).id
            };
        },
        renderTitle: function() {
            return this.props.application.get('name_or_id');
        },
        updateState: function(key, e) {
            var value = e.target.value;
            var state = {};
            state[key] = value;
            this.setState(state);
        },
        renderBody: function() {
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
                        machines: this.props.application.get('machines') ,
                        onChange: _.bind(this.updateState, this, 'machineId')})),
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'identity'}, "Identity"),
                    IdentitySelect({
                        onChange: _.bind(this.updateState, this, 'identityId'), 
                        identityId: this.state.identityId,
                        identities: this.props.identities})),
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'size'}, "Instance Size"),
                    InstanceSizeSelect({
                        providerId: identity.get('provider_id'),
                        identityId: identity.id,
                        sizeId: this.state.sizeId,
                        onChange: _.bind(this.updateState, this, 'sizeId')})));
        },
        launchInstance: function(e) {
            e.preventDefault();
            console.log(this.state);
        },
        renderFooter: function() {
            return React.DOM.button({type: 'submit',
                className: 'btn btn-primary',
                onClick: this.launchInstance}, "Launch");
        }
    });

    return LaunchApplicationModal;

});
