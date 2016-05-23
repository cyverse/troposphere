import React from 'react/addons';
import Backbone from 'backbone';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';

export default React.createClass({
    displayName: "ExternalLinkDeleteModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
      link: React.PropTypes.instanceOf(Backbone.Model).isRequired
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
      var link = this.props.external_link;
      return (
        <div>
          <p>
            {"Are you sure you want to delete the link "}
            <strong>{link.get('name')}</strong>
            {"?"}
          </p>

          <p>
            {"The link will be destroyed and "}
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
                <strong>Delete Link</strong>
              </div>
              <div className="modal-body">
                {this.renderBody()}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={this.cancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={this.confirm}>
                  Yes, delete this link
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
});
