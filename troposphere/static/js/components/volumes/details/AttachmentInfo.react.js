/** @jsx React.DOM */

define(
  [
    'react',
    './AttachmentForm.react',
    './DestroyForm.react',
    './DetachmentForm.react',
    'backbone'
  ],
  function (React, AttachmentForm, DestroyForm, DetachmentForm, Backbone) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var volume = this.props.volume;
        var state = volume.get('status');
        var isAvailable = (state === 'available' || state === 'attaching');
        var isAttached = (state === 'in-use' || state === 'detaching');
        var attachData = volume.get('attach_data');
        var content;

        if (isAvailable) {
          content = [
            <p key='statusText'>Available</p>,
            <p key='attachment'>
              <AttachmentForm volume={this.props.volume} instances={this.props.instances}/>
            </p>,
            <p key='destroy'>
              <DestroyForm volume={this.props.volume}/>
            </p>
          ];
        } else if (isAttached) {
          content = [
            <p key='statusText'>
              Attached to instance {attachData.instance_id} as device <code>{attachData.device}</code>
            </p>,
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
