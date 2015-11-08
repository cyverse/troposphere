import React from 'react';
import Backbone from 'backbone';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';

export default React.createClass({
      displayName: "ProjectRemoveResourceModal",

      mixins: [BootstrapModalMixin],

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      isSubmittable: function () {
        return true;
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

      renderResource: function (resource) {
        return (
          <li key={resource.id}>{resource.get('name')}</li>
        );
      },

      renderBody: function () {
        return (
          <div role='form'>

            <div className='form-group'>
              <label htmlFor='volumeSize'>Resources to Remove</label>

              <p>If you are viewing this you have administrative rights for Atmosphere. The following resources will be
                removed from the project:</p>
              <ul>
                {this.props.resources.map(this.renderResource)}
              </ul>
            </div>

          </div>
        )
      },

      render: function () {
        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Remove Resources</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}
                          disabled={!this.isSubmittable()}>
                    Remove resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
});
