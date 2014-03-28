define(['react', 'underscore', 'components/page_header',
'components/common/time', 'providers', 'collections/instances'], function(React, _, PageHeader, Time,
providers, Instances) {

    var VolumeInfo = React.createClass({
        render: function() {
            var volume = this.props.volume;
            var provider = providers.get(volume.get('provider'));
            var name = "(Unnamed Volume)";
            if (volume.get('name') !== undefined)
                name = volume.get('name');

            var items = [
                ["Name", name],
                ["ID", volume.id],
                ["Provider", provider.get('name')],
                ["Date Created", Time({date: volume.get('create_time')})]
            ];

            var result = React.DOM.div({}, React.DOM.h2({}, "Details"), React.DOM.dl({}, _.map(items, function(item) {
                return [
                    React.DOM.dt({}, item[0]),
                    React.DOM.dd({}, item[1])
                ];
            })));
            return result;
        }
    });

    var AttachmentForm = React.createClass({
        getInitialState: function() {
            return {attaching: false};
        },
        handleSubmit: function(e) {
            e.preventDefault();
            console.log(e);
            this.setState({attaching: true});
        },
        getInstanceSelect: function() {
            var options = [];
            if (this.props.instances)
                options = this.props.instances.map(function(instance) {
                    return React.DOM.option({}, instance.get('name_or_id'));
                });
            return React.DOM.select({className: 'form-control', disabled: this.state.attaching}, options);
        },
        getAttachButton: function() {
            var attaching = this.state.attaching;
            var attrs = {className: 'btn btn-primary btn-block'};
            if (attaching) {
                attrs.className += ' disabled';
                attrs.disabled = 'disabled';
            }
            return React.DOM.button(attrs, attaching ? "Attaching..." : "Attach");
        },
        render: function() {
            return React.DOM.form({onSubmit: this.handleSubmit},
                React.DOM.div({className: 'container-fluid'},
                    React.DOM.div({className: 'row'},
                        React.DOM.div({className: 'col-xs-9'}, this.getInstanceSelect()),
                        React.DOM.div({className: 'col-xs-3'}, this.getAttachButton()))));
        }
    });

    var AttachmentInfo = React.createClass({
        render: function() {
            var volume = this.props.volume;
            var content = [];
            var available = volume.get('status') == 'available';

            if (available)
                content = AttachmentForm({volume: this.props.volume,
                    instances: this.props.instances});

            return React.DOM.div({},
                React.DOM.h2({}, "Status"),
                React.DOM.p({}, available ? 'Unattached' : 'Attached'),
                content);
        }
    });

    var VolumeDetail = React.createClass({
        getInitialState: function() {
            return {instances: null};
        },
        setInstances: function(instances) {
            if (this.isMounted())
                this.setState({instances: instances}); 
        },
        componentDidMount: function() {
            var provider_id = this.props.volume.get('identity').provider;
            var identity_id = this.props.volume.get('identity').id;
            var instances = new Instances([], {provider_id: provider_id, identity_id: identity_id});
            instances.on('sync', this.setInstances);
            instances.fetch();
        },
        componentWillUnmount: function() {
            if (this.state.instances)
                this.state.instances.off('sync', this.setInstances);
        },
        helpText: function() {
            var p1 = React.DOM.p({}, "A volume is available when it is not attached to an instance. Any newly created volume must be formatted and then mounted after it has been attached before you will be able to use it.");
            var links = [
                ["Creating a Volume", "https://pods.iplantcollaborative.org/wiki/x/UyWO"],
                ["Attaching a Volume to an Instance", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Attachingavolumetoaninstance"],
                ["Formatting a Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Createthefilesystem%28onetimeeventpervolume%29"],
                ["Mounting a Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Mountthefilesystemonthepartition"],
                ["Unmounting and Detaching Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Detachingvolumesfrominstances"]
            ];
            var link_list = React.DOM.ul({}, _.map(links, function(item) {
                return React.DOM.li({}, React.DOM.a({href: item[1]}, item[0]));
            }));
            var p2 = React.DOM.p({}, "More information about volumes:", link_list);
            return React.DOM.div({}, p1, p2);
        },
        render: function() {
            var volume = this.props.volume;
            var instances = this.state.instances;
            console.log(volume);
            return React.DOM.div({}, 
                PageHeader({title: "Volume: " + volume.get('name_or_id'), helpText: this.helpText}),
                VolumeInfo({volume: volume}),
                AttachmentInfo({volume: volume, instances: instances}));
        }
    });

    return VolumeDetail;
});
