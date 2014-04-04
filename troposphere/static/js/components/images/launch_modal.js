define(['react', 'singletons/providers', 'singletons/profile',
'collections/sizes', 'components/mixins/modal',
'controllers/providers'], function(React, providers, profile, Sizes,
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
                value: this.props.value, 
                className: 'form-control',
                id: 'size',
                onChange: this.props.onChange}, options);
        }
    });

    var IdentitySelect = React.createClass({
        render: function() {
            var options = profile.get('identities').map(function(identity) {
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

    var LaunchApplicationModal = React.createClass({
        mixins: [ModalMixin],
        getInitialState: function() {
            var defaultIdentity = profile.get('identities').at(0);
            return {
                instanceName: '',
                identityId: defaultIdentity.id
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
            var identity = profile.get('identities').get(this.state.identityId);
            return React.DOM.form({role: 'form'},
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'instance-name'}, "Instance Name"),
                    React.DOM.input({type: 'text',
                        className: 'form-control',
                        id: 'instance-name',
                        onChange: _.bind(this.updateState, this, 'instanceName')})),
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'identity'}, "Identity"),
                    IdentitySelect({
                        onChange: _.bind(this.updateState, this, 'identityId'), 
                        identityId: this.state.identityId})),
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'size'}, "Instance Size"),
                    InstanceSizeSelect({
                        providerId: identity.get('provider_id'),
                        identityId: identity.id,
                        onChange: _.bind(this.updateState, this, 'sizeId')})));
        },
        launchInstance: function(e) {
            e.preventDefault();
        },
        renderFooter: function() {
            return React.DOM.button({type: 'submit',
                className: 'btn btn-primary',
                onClick: this.launchInstance}, "Launch");
        }
    });

    return LaunchApplicationModal;

});
