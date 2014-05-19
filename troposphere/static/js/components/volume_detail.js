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
    './AttachmentInfo.react',
    './VolumeDetailPage.react'
  ], function (React, _, PageHeader, Time, Instances, VolumeController, LoadingMixin, Volume, RSVP, VolumeInfo, AttachmentForm, DestroyForm, DetachmentForm, AttachmentInfo, VolumeDetailpage) {

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
