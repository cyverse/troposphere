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
    './VolumeDetailPage.react',
    './VolumeDetail.react'
  ], function (React, _, PageHeader, Time, Instances, VolumeController, LoadingMixin, Volume, RSVP, VolumeInfo, AttachmentForm, DestroyForm, DetachmentForm, AttachmentInfo, VolumeDetailpage, VolumeDetail) {

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
