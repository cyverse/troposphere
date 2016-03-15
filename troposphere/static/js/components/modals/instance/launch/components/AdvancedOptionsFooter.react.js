import React from 'react';
import Button from 'components/common/ui/Button.react';

export default React.createClass({

    render: function() {
        let saveOptionsDisabled = this.props.saveOptionsDisabled ? "disabled" : "";
        let clearOptionsIsDisabled = this.props.footerDisabled ?
            this.props.footerDisabled :
            this.props.clearOptionsIsDisabled;
        let tooltipTitle = this.props.clearOptionsIsDisabled ?
            "Advanced Options have been reset to default values" :
            "Warning, changes to Advanced Options will be lost";



        return (
            <div className="modal-footer">
                <Button
                    style={{float:"right"}}
                    isDisabled={this.props.footerDisabled}
                    buttonType="default"
                    title="Continue to Launch"
                    onTouch={this.props.onSaveAdvanced}
                />
                <Button
                    style={{float:"left"}}
                    isDisabled={clearOptionsIsDisabled}
                    buttonType="link"
                    title="Restore Advaced Options"
                    onTouch={this.props.onClearAdvanced}
                />
            </div>
        )
    }
});
