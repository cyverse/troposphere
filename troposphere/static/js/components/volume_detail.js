define(['react', 'underscore', 'components/page_header',
'components/common/time', 'collections/instances',
'controllers/volumes', 'components/mixins/loading', 'collections/volumes',
'rsvp'], function(React, _, PageHeader, Time, Instances, VolumeController,
LoadingMixin, Volumes, RSVP) {

    var VolumeInfo = React.createClass({
        render: function() {
            var volume = this.props.volume;
            var provider = this.props.providers.get(volume.get('identity').provider);
            var name = "(Unnamed Volume)";
            if (volume.get('name') !== undefined)
                name = volume.get('name');

            var items = [
                ["Name", name],
                ["ID", volume.id],
                ["Provider", provider.get('name')],
                ["Date Created", Time({date: volume.get('start_date')})]
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
            return {
                instance: this.props.instances ? this.props.instances.at(0) : null
            };
        },
        componentWillReceiveProps: function(newProps) {
            var instances = newProps.instances;
            if (instances && instances.length)
                this.setState({instance: instances.at(0)});
        },
        handleSubmit: function(e) {
            e.preventDefault();
            var volume = this.props.volume;
            VolumeController
                .attach(this.props.volume, this.state.instance);
        },
        handleChange: function(e) {
            var instance = this.props.instances.get(e.target.value);
            this.setState({instance: instance});
        },
        getInstanceSelect: function() {
            var options = [];
            if (this.props.instances)
                options = this.props.instances.map(function(instance) {
                    return React.DOM.option({value: instance.id}, instance.get('name_or_id'));
                });
            var attaching = this.props.volume.get('status') == 'attaching';
            return React.DOM.select({
                className: 'form-control',
                disabled: attaching,
                onChange: this.handleChange,
                value: this.state.instance ? this.state.instance.id : null
            }, options);
        },
        getAttachButton: function() {
            var attaching = this.props.volume.get('status') == 'attaching';
            var attrs = {className: 'btn btn-primary btn-block'};
            if (attaching || !this.state.instance) {
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

    var DestroyForm = React.createClass({
        handleClick: function(e) {
            e.preventDefault();
            console.log("destroy");
            VolumeController.destroy(this.props.volume);
        },
        render: function() {
            return React.DOM.button({
                className: 'btn btn-default',
                onClick: this.handleClick
            }, "Destroy Volume");
        }
    });

    var DetachmentForm = React.createClass({
        handleSubmit: function(e) {
            e.preventDefault();
            var provider = this.props.providers.get(this.props.volume.get('identity').provider);
            VolumeController.detach(this.props.volume, provider);
        },
        render: function() {
            var detaching = this.props.volume.get('status') === 'detaching';

            var buttonAttrs = {className: 'btn btn-primary'};
            if (detaching) {
                buttonAttrs.className += ' disabled';
                buttonAttrs.disabled = true;
            }

            return React.DOM.form({onSubmit: this.handleSubmit},
                React.DOM.label({htmlFor: 'attached_instance'}),
                React.DOM.button(buttonAttrs, detaching ? "Detaching..." : "Detach"));
        }
    });

    var AttachmentInfo = React.createClass({
        render: function() {
            var volume = this.props.volume;
            var content = [];
            var state = volume.get('status');
            var available = state == 'available' || state == 'attaching';
            var attached = state == 'in-use' || state == 'detaching';

            if (available) {
                content = [
                    React.DOM.p({key: 'statusText'}, "Available"),
                    React.DOM.p({key: 'attachment'},
                        AttachmentForm({volume: this.props.volume, instances: this.props.instances})),
                    React.DOM.p({key: 'destroy'},
                        DestroyForm({volume: this.props.volume}))
                ];
            } else if (attached) {
                var attachData = volume.get('attach_data');
                var attachedText = [
                    "Attached to instance ",
                    attachData.instance_id,
                    " as device ",
                    React.DOM.code({}, attachData.device)
                ];
                content = [
                    React.DOM.p({key: 'statusText'}, attachedText),
                    DetachmentForm({key: 'detachment', 
                        volume: this.props.volume,
                        providers: this.props.providers})
                ];
            }

            return React.DOM.div({},
                React.DOM.h2({}, "Status"),
                content);
        }
    });

    var VolumeDetailPage = React.createClass({
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
            var instances = this.props.instances;
            return React.DOM.div({},
                PageHeader({title: "Volume: " + volume.get('name_or_id'), helpText: this.helpText}),
                VolumeInfo({volume: volume, providers: this.props.providers}),
                AttachmentInfo({volume: volume, instances: instances, providers: this.props.providers}));
        }
    });

    var VolumeDetail = React.createClass({
        getInitialState: function() {
            return {
                instances: null,
                volume: this.props.volume
            };
        },
        setVolume: function(volume) {
            this.setState({volume: volume});
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

            this.state.volume.on('change', this.setVolume);
        },
        componentWillUnmount: function() {
            if (this.state.instances)
                this.state.instances.off('sync', this.setInstances);

            this.state.volume.off('change', this.setVolume);
        },
        render: function() {
            return VolumeDetailPage({
                volume: this.state.volume,
                instances: this.state.instances,
                providers: this.props.providers
            });
        }
    });

    var VolumeDetailWrapper = React.createClass({
        mixins: [LoadingMixin],
        model: function() {
            var volumes = new Volumes([], {
                provider_id: this.props.providerId, 
                identity_id: this.props.identityId
            });
            var volumeId = this.props.volumeId
            return new RSVP.Promise(function(resolve, reject) {
                volumes.fetch({success: function() {
                    var volume = volumes.get(volumeId);
                    if (volume === undefined)
                        throw "Unknown volume " + volume_id;
                    resolve(volume);
                }});
            });
        },
        renderContent: function() {
            return VolumeDetail({
                volume: this.state.model,
                providers: this.props.providers
            });
        }
    });

    return VolumeDetailWrapper;
});
