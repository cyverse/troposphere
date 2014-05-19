/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    'components/PageHeader.react',
    'components/common/Time.react',
    'collections/instances',
    'controllers/volumes',
    'components/mixins/loading',
    'models/volume',
    'rsvp',
    './VolumeInfo.react',
    './AttachmentForm.react',
    './DestroyForm.react',
    './DetachmentForm.react',
    './AttachmentInfo.react'
  ], function (React, _, PageHeader, Time, Instances, VolumeController, LoadingMixin, Volume, RSVP, VolumeInfo, AttachmentForm, DestroyForm, DetachmentForm, AttachmentInfo) {

    var VolumeDetailPage = React.createClass({
      helpText: function () {
        var p1 = React.DOM.p({}, "A volume is available when it is not attached to an instance. Any newly created volume must be formatted and then mounted after it has been attached before you will be able to use it.");
        var links = [
          ["Creating a Volume", "https://pods.iplantcollaborative.org/wiki/x/UyWO"],
          ["Attaching a Volume to an Instance", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Attachingavolumetoaninstance"],
          ["Formatting a Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Createthefilesystem%28onetimeeventpervolume%29"],
          ["Mounting a Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Mountthefilesystemonthepartition"],
          ["Unmounting and Detaching Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Detachingvolumesfrominstances"]
        ];
        var link_list = React.DOM.ul({}, _.map(links, function (item) {
          return React.DOM.li({}, React.DOM.a({href: item[1]}, item[0]));
        }));
        var p2 = React.DOM.p({}, "More information about volumes:", link_list);
        return React.DOM.div({}, p1, p2);
      },
      render: function () {
        var volume = this.props.volume;
        var instances = this.props.instances;
        return React.DOM.div({},
          PageHeader({title: "Volume: " + volume.get('name_or_id'), helpText: this.helpText}),
          VolumeInfo({volume: volume, providers: this.props.providers}),
          AttachmentInfo({volume: volume, instances: instances, providers: this.props.providers}));
      }
    });

    var VolumeDetail = React.createClass({
      getInitialState: function () {
        return {
          instances: null,
          volume: this.props.volume
        };
      },
      setVolume: function (volume) {
        this.setState({volume: volume});
      },
      setInstances: function (instances) {
        if (this.isMounted())
          this.setState({instances: instances});
      },
      componentDidMount: function () {
        var provider_id = this.props.volume.get('identity').provider;
        var identity_id = this.props.volume.get('identity').id;
        var instances = new Instances([], {provider_id: provider_id, identity_id: identity_id});
        instances.on('sync', this.setInstances);
        instances.fetch();

        this.state.volume.on('change', this.setVolume);
      },
      componentWillUnmount: function () {
        if (this.state.instances)
          this.state.instances.off('sync', this.setInstances);

        this.state.volume.off('change', this.setVolume);
      },
      render: function () {
        return VolumeDetailPage({
          volume: this.state.volume,
          instances: this.state.instances,
          providers: this.props.providers
        });
      }
    });

    var VolumeDetailWrapper = React.createClass({
      componentDidMount: function () {
        if (!this.props.volume)
          this.props.onRequestVolume();
      },
      render: function () {
        if (this.props.volume)
          return VolumeDetail({
            volume: this.props.volume,
            providers: this.props.providers
          });
        else
          return React.DOM.div({className: 'loading'});
      }
    });

    return VolumeDetailWrapper;
  });
