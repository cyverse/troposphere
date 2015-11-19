var React = require('react');
var BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react');

module.exports = React.createClass({

      mixins: [BootstrapModalMixin],

      render: function () {
          var self = this;
        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content badge-modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>title</strong>
                </div>
                <div className="modal-body">
                  body
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.hide}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.props.onConfirm}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

});
