/** @jsx React.DOM */

define(
  [
    'react',
    'controllers/instances',
    'url',
    'components/common/ButtonDropdown.react',
    'components/common/Glyphicon.react'
  ],
  function (React, InstanceController, URL, ButtonDropdown, Glyphicon) {

    return React.createClass({

      renderButton: function (text, onClick, disabled) {
        return (
          <button className='btn btn-default' onClick={onClick} disabled={disabled}>
            {text}
          </button>
          );
      },

      renderStartStopButton: function () {
        if (!this.props.isOpenstack) return null;

        if (this.props.instance.get('status') == 'shutoff') {
          return this.renderButton(
            [<Glyphicon name='share-alt'/>, " Start"],
            InstanceController.start.bind(null, this.props.instance)
          );

        } else {
          return this.renderButton(
            [<Glyphicon name='stop'/>, " Stop"],
            InstanceController.stop.bind(null, this.props.instance)
          );
        }
      },

      renderSuspendButton: function () {
        if (!this.props.isOpenstack) return null;

        var disabled = !this.props.instance.get('is_active');

        if (this.props.instance.get('status') == 'suspended') {
          return this.renderButton(
            [<Glyphicon name='play'/>, ' Resume'],
            InstanceController.resume.bind(null, this.props.instance)
          );

        } else {
          return this.renderButton(
            [<Glyphicon name='pause'/>, ' Suspend'],
            InstanceController.suspend.bind(null, this.props.instance),
            disabled
          );
        }
      },

      renderRebootButton: function () {
        var disabled = !this.props.instance.get('is_active');
        var items = [
          <li><a>Soft reboot</a></li>
        ];
        if (this.props.isOpenstack) {
          items.push(
            <li><a>Hard reboot</a></li>
          );
        }

        var buttonContent = [<Glyphicon name='repeat'/>, " Reboot"];
        return (
          <ButtonDropdown buttonContent={buttonContent} disabled={disabled}>
            {items}
          </ButtonDropdown>
        );
      },

      renderTerminateButton: function () {
        var handleClick = InstanceController.terminate.bind(null, this.props.instance);
        return this.renderButton(
          [<Glyphicon name='remove'/>, " Terminate"],
          handleClick
        );
      },

      renderResizeButton: function () {
        if (!this.props.isOpenstack) return null;

        var disabled = !this.props.instance.get('is_active') || this.props.instance.get('is_resize');
        return this.renderButton(
          [<Glyphicon name='resize-full'/>, " Resize"],
          null,
          disabled
        );
      },

      renderImageRequestButton: function () {
        var disabled = !this.props.instance.get('is_active');
        return this.renderButton(
          [<Glyphicon name='camera'/>, " Image"],
          null,
          disabled
        );
      },

      renderReportButton: function () {
        var disabled = !this.props.instance.get('is_active');

        var onClick = function () {
          var url = URL.reportInstance(this.props.instance);
          Backbone.history.navigate(url, {trigger: true});
        }.bind(this);

        return this.renderButton(
          [<Glyphicon name='inbox'/>, " Report"],
          onClick,
          disabled
        );
      },

      render: function () {
        return (
          <div>
            <h2>Actions</h2>
            <div>
              {this.renderStartStopButton()} // OS only
              {this.renderSuspendButton()} // OS only
              {this.renderRebootButton()}
              {this.renderTerminateButton()}
              {this.renderResizeButton()} // OS only
              {this.renderImageRequestButton()}
              {this.renderReportButton()}
            </div>
          </div>
        );
      }
    });

  });
