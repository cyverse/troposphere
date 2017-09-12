import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import Button from "components/common/ui/Button";

export default React.createClass({
    onClearAdvanced: function() {
        this.props.onClearAdvanced();
    },

    render: function() {
        let clearOptionsIsDisabled = this.props.footerDisabled
            ? this.props.footerDisabled
            : this.props.clearOptionsIsDisabled;
        let tooltipTitle = this.props.clearOptionsIsDisabled
            ? "Advanced Options have been reset to default values"
            : "Warning, changes to Advanced Options will be lost";

        return (
        <div className="modal-footer">
            <RaisedButton
                style={{ float: "right" }}
                disabled={this.props.footerDisabled}
                label="Continue to Launch"
                onTouchTap={this.props.onSaveAdvanced}
            />
            <Button style={{ float: "left" }}
                isDisabled={clearOptionsIsDisabled}
                buttonType="link"
                title="Restore Default Options"
                icon="refresh"
                onTouch={this.onClearAdvanced}
                tooltip={tooltipTitle} />
        </div>
        )
    }
});
