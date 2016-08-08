import React from 'react';
import Backbone from 'backbone';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';
import stores from 'stores';

export default React.createClass({
      displayName: "NoAllocationSourceModal",

      mixins: [BootstrapModalMixin],

      propTypes: {
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
      },

      //
      // Render
      // ------
      //
      renderBody: function () {
        return (
          <div role='form'>
              <p>{"Looks like you have some instances without an Allocation Source!"}</p>
          </div>
        );
      },

      render: function () {
        var projects = stores.ProjectStore.getAll();
        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <strong>Select Allocation Sources for Your Instances</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={this.confirm}>
                    Confirm Selections
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
});
