
define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'components/common/Glyphicon.react'
  ],
  function (React, Backbone, BootstrapModalMixin, Glyphicon) {

    return React.createClass({
      displayName: "VolumeDetachModal",

      mixins: [BootstrapModalMixin],

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        helplink: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function () {
        this.hide();
      },

      confirm: function () {
        this.hide();
        this.props.onConfirm();
      },

      //
      // Render
      // ------
      //

      renderBody: function () {
        var volume = this.props.volume,
            helplink = this.props.helplink;

        return (
          <div>
            <p className='alert alert-danger'>
              <Glyphicon name='warning-sign'/>
              <strong>{"WARNING "}</strong>
              {
                `If data is being written to the volume when it's detached, the data may become corrupted. Therefore, ` +
                `we recommend you make sure there is no data being written to the volume before detaching it.`
              }
            </p>

            <p>
              {"Would you like to detach the volume "}
              <strong>{volume.get('name')}</strong>
              {"?"}
            </p>

            <p>
              <a
                href={this.props.helplink.get('href')}
                target="_blank">
                {"Learn more about unmounting and detaching a volume"}
              </a>
            </p>
          </div>
        );
      },

      render: function () {

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Detach Volume</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}>
                    Yes, detach the volume
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
