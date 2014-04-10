define(['react', 'components/page_header', 'components/mixins/loading', 'collections/instances', 'rsvp'], function(React, PageHeader, LoadingMixin, Instances, RSVP) {
    
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
                        throw "Unknown instance " + instance_id;
                    resolve(instance);
                }});
            });
        },
        renderContent: function() {
            console.log(this.state.model);
            return PageHeader({title: "Instance: " + this.state.model.get('name_or_id')})
        }
    });

    return InstanceDetail;
});
