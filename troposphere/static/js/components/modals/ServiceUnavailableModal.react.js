define(function (require) {

  var React = require('react/addons'),
    BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react');

  return React.createClass({
    mixins: [BootstrapModalMixin],

    cancel: function () {
      this.hide();
    },

    confirm: function () {
      this.hide();
      this.props.onConfirm();
    },

    renderBody: function () {
      return (
        <div role='form'>
          <div className='form-group'>
            <p>
              {
                "Atmosphere is currently under maintenance. This message will " +
                "automatically go away once maintenance is completed."
              }
            </p>
          </div>
        </div>
      );
    },

    render: function () {
      return (
        <div className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <strong>Atmosphere Maintenance</strong>
              </div>
              <div className="modal-body">
                {this.renderBody()}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={this.confirm}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

  });

});
