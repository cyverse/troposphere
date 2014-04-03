define(['react', 'singletons/providers', 'singletons/profile',
'collections/sizes', 'components/mixins/modal'], function(React, providers,
profile , Sizes, ModalMixin) {

    var InstanceSizeSelect = React.createClass({
        componentDidMount: function() {
            console.log('mount');
            this.props.sizes.on('sync', this.forceUpdate);
            this.props.sizes.fetch();
        },
        componentWillReceiveProps: function(nextProps) {
            console.log('receive');
            this.props.sizes.off('sync', this.forceUpdate);
            nextProps.sizes.on('sync', this.forceUpdate);
            nextProps.sizes.fetch();
        },
        renderOptionText: function(size) {
            return size.get('name');
        },
        render: function() {
            console.log('render');
            var options = this.props.sizes.map(function(size) {
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
            console.log(providers);
            console.log(profile);
            var identity = profile.get('identities').get(this.state.identityId);
            console.log(identity);
            var sizes = new Sizes([], {
                provider_id: identity.get('provider_id'),
                identity_id: identity.id
            });
            console.log(sizes);
            return React.DOM.form({role: 'form'},
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'instance-name'}, "Instance Name"),
                    React.DOM.input({type: 'text', className: 'form-control', id: 'instance-name'})),
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'identity'}, "Identity"),
                    IdentitySelect({
                        onChange: _.bind(this.updateState, this, 'identityId'), 
                        identityId: this.state.identityId})),
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'size'}, "Instance Size"),
                    InstanceSizeSelect({sizes: sizes})));
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
