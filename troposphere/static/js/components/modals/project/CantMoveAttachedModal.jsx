import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";


export default React.createClass({
    displayName: "CantMoveAttached",

    mixins: [BootstrapModalMixin],

    confirm: function() {
        this.hide();
    },

    render: function() {
        var content = (
        <div>
            <h4 className="t-body-2">You are trying to move attached resources</h4>
            <p>
                An instance or volume cannot be moved while attached. To move these resources, please detach them by first selecting the attached volume and then selecting the detach
                option on the top right.
            </p>
        </div>
        );

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="t-title">Resources Still Attached</h1>
                    </div>
                    <div className="modal-body">
                        {content}
                    </div>
                    <div className="modal-footer">
                        <RaisedButton
                            primary
                            onTouchTap={this.confirm}
                            label="OK"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
