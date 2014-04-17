define(['react', 'components/page_header', 'components/mixins/loading',
'collections/instances', 'rsvp', 'components/common/time'], function(React,
PageHeader, LoadingMixin, Instances, RSVP, Time) {

    var InstanceAttributes = React.createClass({
        renderPair: function(k, v) {
            return [React.DOM.dt({}, k), React.DOM.dd({}, v)];
        },
        renderIdentity: function(identity) {
            var text = identity.id + " on provider ";
            if (this.props.providers) {
                var provider = this.props.providers.get(identity.provider);
                text += provider.get('name');
            } else
                text += identity.provider;
            return text;
        },
        render: function() {
            var instance = this.props.instance;
            return React.DOM.dl({},
                this.renderPair("Status", instance.get('status')),
                this.renderPair("IP Address", instance.get('ip_address')),
                this.renderPair("Identity", this.renderIdentity(instance.get('identity'))),
                this.renderPair("ID", instance.id),
                this.renderPair("Date Launched", Time({date: instance.get('start_date')})));
        }
    });

    var InstanceLinks = React.createClass({
        renderLink: function(text, url) {
            return React.DOM.li({},
                React.DOM.a({href: url,
                    target: '_blank', 
                    className: 'new-window'}, text));
        },
        render: function() {
            var instance = this.props.instance;
            return React.DOM.ul({},
                this.renderLink("Web Shell", instance.get('shell_url')),
                this.renderLink("Remote Desktop", instance.get('vnc_url')));
        }
    });

    var InstancePage = React.createClass({
        render: function() {
            var instance = this.props.instance;
            return React.DOM.div({},
                PageHeader({title: "Instance: " + instance.get('name_or_id')}),
                InstanceAttributes({instance: instance, 
                    providers: this.props.providers}),
                InstanceLinks({instance: instance}));
        }
    });
    
    var InstanceDetail = React.createClass({
        mixins: [LoadingMixin],
        model: function() {
            var coll = new Instances([], {
                provider_id: this.props.providerId, 
                identity_id: this.props.identityId
            });
            var instanceId = this.props.instanceId;
            return new RSVP.Promise(function(resolve, reject) {
                coll.fetch({success: function() {
                    var instance = coll.get(instanceId);
                    if (instance === undefined)
                        reject("Unknown instance " + instanceId);
                    resolve(instance);
                }});
            });
        },
        renderContent: function() {
            console.log(this.state.model);
            return InstancePage({instance: this.state.model, providers: this.props.providers});
        }
    });

    return InstanceDetail;
});
