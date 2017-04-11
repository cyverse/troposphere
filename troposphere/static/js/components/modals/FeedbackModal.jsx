import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import { trackAction } from "../../utilities/userActivity";

// Example Usage from http://bl.ocks.org/insin/raw/8449696/
// render: function(){
// <div>
//   ...custom components...
//   <ExampleModal
//      ref="modal"
//      show={false}
//      header="Example Modal"
//      buttons={buttons}
//      handleShow={this.handleLog.bind(this, 'Modal about to show', 'info')}
//      handleShown={this.handleLog.bind(this, 'Modal showing', 'success')}
//      handleHide={this.handleLog.bind(this, 'Modal about to hide', 'warning')}
//      handleHidden={this.handleLog.bind(this, 'Modal hidden', 'danger')}
//    >
//      <p>I'm the content.</p>
//      <p>That's about it, really.</p>
//    </ExampleModal>
// </div>
//

// To show the modal, call this.refs.modal.show() from the parent component:
// handleShowModal: function() {
//   this.refs.modal.show();
// }

function getState() {
    return {
        feedback: null
    }
}

export default React.createClass({
    displayName: "FeedbackModal",

    mixins: [BootstrapModalMixin],

    //
    // Mounting & State
    // ----------------
    //
    getInitialState: function() {
        return getState();
    },

    updateState: function() {
        if (this.isMounted()) this.setState(getState());
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
        this.props.onConfirm(this.state.feedback);
        trackAction("sent-feedback", {});
    },


    //
    // Custom Modal Callbacks
    // ----------------------
    //

    onFeedbackChange: function(e) {
        var newFeedback = e.target.value;
        this.setState({
            feedback: newFeedback
        });
    },

    //
    // Render
    // ------
    //

    render: function() {
        var buttonArray = [
            {
                type: null,
                text: "Cancel",
                handler: this.cancel
            },
            {
                type: "primary",
                text: this.props.confirmButtonMessage,
                handler: this.confirm
            }
        ];

        var buttons = buttonArray.map(function(button) {
            // Enable all buttons be default
            var isDisabled = false;

            // Disable the launch button if the user hasn't provided a name, size or identity for the volume
            var stateIsValid = this.state.feedback;
            if (button.type === "primary" && !stateIsValid)
                isDisabled = true;

            return (
            <RaisedButton
                style={{ marginLeft: "10px" }}
                primary={ !!button.type }
                key={button.text}
                onTouchTap={button.handler}
                disabled={isDisabled}
                label={button.text}
            />
            );
        }.bind(this));

        var content = (
        <div role="form">
            <div className="form-group">
                <p>
                    {"Are you experiencing a problem with Atmosphere to which you can't find a solution? " +
                     "Do you have a feature request or bug report? Let us know!"}
                </p>
                <textarea type="text"
                    className="form-control"
                    rows="7"
                    value={this.state.feedback}
                    onChange={this.onFeedbackChange} />
            </div>
        </div>
        );

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">{this.props.header}</h1>
                    </div>
                    <div className="modal-body">
                        {content}
                    </div>
                    <div className="modal-footer">
                        {buttons}
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
