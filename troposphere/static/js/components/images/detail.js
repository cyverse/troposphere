define(['react', 'models/application', 'collections/applications',
'components/images/cards', 'components/mixins/modal', 'jquery',
'components/common/time', 'modal', 'singletons/providers',
'singletons/profile'], function(React, App, AppCollection, Cards, ModalMixin,
$, Time, Modal, providers, profile) {

    var Machine = React.createClass({
        render: function() {
            var machine = this.props.machine;
            console.log(machine);
            return React.DOM.li({}, "Version: ", machine.get('pretty_version'),
                React.DOM.br(),
                "Date: ", Time({date: machine.get('start_date'), showRelative: false}));
        }
    });

    var MachineList = React.createClass({
        render: function() {
            var versions = this.props.machines.map(function(model) {
                return Machine({key: model.id, machine: model});
            });
            return React.DOM.ul({}, versions);
        }
    });

    var LaunchApplicationModal = React.createClass({
        mixins: [ModalMixin],
        getInitialState: function() {
            return {
                instanceName: '',
                identityId: '',
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
        renderIdentityList: function() {
            var options = profile.get('identities').map(function(identity) {
                var provider_name = providers.get(identity.get('provider_id')).get('name');
                return React.DOM.option({value: identity.id},
                    "Identity " + identity.id + " on " + provider_name);
            });
            var callback = _.bind(this.updateState, this, 'identityId');
            return React.DOM.select({
                value: this.state.identityId,
                id: 'identity',
                className: 'form-control',
                onChange: callback}, options);
        },
        renderBody: function() {
            // provider id, identity id, machine_alias, name, size_alias, tags
            console.log(providers);
            console.log(profile);
            return React.DOM.form({role: 'form'},
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'instance-name'}, "Instance Name"),
                    React.DOM.input({type: 'text', className: 'form-control', id: 'instance-name'})),
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'identity'}, "Identity"),
                    this.renderIdentityList()));
        },
        renderFooter: function() {
            return React.DOM.button({type: 'submit', className: 'btn btn-default'}, "Launch");
        }
    });

    var ApplicationDetail = React.createClass({
        getInitialState: function() {
            return {application: null};
        },
        componentDidMount: function() {
            // TODO: This is what should happen if we have API support for it
            /*
            var app = new App({id: this.props.image_id});
            app.fetch({success: function(model) {
                this.setState({image: model});
            }.bind(this)});
            */
            // This is terrible.
            var apps = new AppCollection();
            apps.fetch({success: function(collection) {
                var app = collection.get(this.props.image_id);
                this.setState({application: app});
            }.bind(this)});
        },
        showModal: function(e) {
            Modal.events.trigger('alert', function(onClose) {
                return LaunchApplicationModal({
                    onClose: onClose,
                    application: this.state.application
                });
            }.bind(this));
            //$('#launch-modal').modal('show');
        },
        render: function() {
            var app = this.state.application;

            if (!app)
                return React.DOM.div({className: 'loading'});

            return React.DOM.div({id: 'app-detail'},
                React.DOM.h1({}, app.get('name_or_id')),
                Cards.Rating({rating: app.get('rating')}),
                Cards.ApplicationCard({application: app, onLaunch: this.showModal}),
                React.DOM.h2({}, "Description"),
                React.DOM.p({}, app.get('description')),
                React.DOM.h2({}, "Versions of this Image"),
                MachineList({machines: app.get('machines')}))
        }
    });

    return ApplicationDetail;
});
