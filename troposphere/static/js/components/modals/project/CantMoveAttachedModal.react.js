import React from 'react/addons';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';

export default React.createClass({
    displayName: "CantMoveAttached",

    mixins: [BootstrapModalMixin],

    confirm: function() {
        this.hide();
    },

    render: function () {
        var content = (
            <div>
                <h4>You are trying to move attached resources</h4>
                <p>An instance or volume cannot be moved while attached. To move these resources, please detach them by first selecting the attached volume and then selecting the detach option on the top right.</p>
            </div>
        );

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Resources Still Attached</h3>
                </div>
                <div className="modal-body">
                {content}
                </div>
                <div className="modal-footer">
                <button className="btn btn-primary" onClick={this.confirm} >OK</button>
                </div>
              </div>
            </div>
          </div>
        );
    }
});
