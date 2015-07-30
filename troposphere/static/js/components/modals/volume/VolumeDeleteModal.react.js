/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'components/common/Glyphicon.react'
  ],
  function (React, Backbone, BootstrapModalMixin, Glyphicon) {

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
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
        var volume = this.props.volume;
        return (
          <div>
            <p>
              {"Are you sure you want to delete the volume "}
              <strong>{volume.get('name')}</strong>
              {"?"}
            </p>

            <p>
              {"The volume will be destroyed and "}
              <strong style={{"textDecoration":"underline"}}>all data will be permanently lost</strong>
              {"."}
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
                  <strong>Delete Volume</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}>
                    Yes, delete this volume
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
