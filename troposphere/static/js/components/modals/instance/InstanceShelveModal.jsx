import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";

export default React.createClass({
    displayName: "InstanceShelveModal",

    mixins: [BootstrapModalMixin],

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
        this.props.onConfirm();
    },

    //
    // Render
    // ------
    //

    renderBody: function() {
        return (
            <div>
                <p className="alert alert-warning">
                    <Glyphicon name="warning-sign" /> <strong>WARNING</strong>
                    {
                        " Shelving an instance will freeze its state, and the IP address be removed from the instance."
                    }
                </p>
                <p>
                    {
                        'Shelving will safely preserve the state of your instance for later use. And, it frees up resources for other users . In fact, it is the best way to reduce resource usage when compared with other actions, like "suspend" and "stop".'
                    }
                    {
                        "Your time allocation no longer counts against you in the shelved mode."
                    }
                </p>
                <p>
                    {
                        'Your resource usage charts will only reflect the freed resources once the instance\'s state is "shelved."'
                    }
                </p>
            </div>
        );
    },

    render: function() {
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <h1 className="t-title">Shelve Instance</h1>
                        </div>
                        <div className="modal-body">{this.renderBody()}</div>
                        <div className="modal-footer">
                            <RaisedButton
                                style={{marginRight: "10px"}}
                                onTouchTap={this.cancel}
                                label="Cancel"
                            />
                            <RaisedButton
                                primary
                                onTouchTap={this.confirm}
                                label="Yes, shelve this instance"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
