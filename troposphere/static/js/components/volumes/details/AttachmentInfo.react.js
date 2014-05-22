/** @jsx React.DOM */

define(
  [
    'react',
    './AttachmentForm.react',
    './DestroyForm.react',
    './DetachmentForm.react'
  ],
  function (React, AttachmentForm, DestroyForm, DetachmentForm) {

    return React.createClass({

      render: function () {
        var volume = this.props.volume;
        var content = [];
        var state = volume.get('status');
        var available = state == 'available' || state == 'attaching';
        var attached = state == 'in-use' || state == 'detaching';

        if (available) {
          content = [
            <p key='statusText'>Available</p>,
            <p key='attachment'>
              <AttachmentForm volume={this.props.volume} instances={this.props.instances}/>
            </p>,
            <p key='destroy'>
              <DestroyForm volume={this.props.volume}/>
            </p>
          ];

        } else if (attached) {
          var attachData = volume.get('attach_data');
          var attachedText = [
            "Attached to instance ",
            attachData.instance_id,
            " as device ",
            <code>{attachData.device}</code>
          ];
          content = [
            <p key='statusText'>{attachedText}</p>,
            <DetachmentForm key='detachment' volume={this.props.volume} providers={this.props.providers}/>
          ];
        }

        return (
          <div>
            <h2>Status</h2>
            {content}
          </div>
        );
      }

    });

  });
