import React from 'react';
import Backbone from 'backbone';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';
import Glyphicon from 'components/common/Glyphicon.react';

export default React.createClass({
      displayName: "InstanceDeleteModal",

      mixins: [BootstrapModalMixin],

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
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
        var instance = this.props.instance;

        return (
          <div>
            <p className='alert alert-danger'>
              <Glyphicon name='warning-sign'/>
              <strong>WARNING</strong>
              {
                ' Unmount volumes within your instance ' +
                'before deleting the instance or risk corrupting your data and the volume'
              }
            </p>

            <p>
              {'Your instance '}
              <strong>{instance.get('name') + ' #' + instance.get('id')}</strong>
              {' will be shut down and all data will be permanently lost!'}
            </p>

            <p>
              <em>Note:</em>
              {
                ' Your resource usage charts will not reflect changes until the ' +
                'instance is completely deleted and has disappeared ' +
                'from your list of instances.'
              }
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
                  <strong>Delete Instance</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}>
                    Yes, delete this instance
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
});
