import React from 'react';
import Button from 'components/common/ui/Button.react';

export default React.createClass({

    render: function() {
        let saveOptionsDisabled = this.props.saveOptionsDisabled ? "disabled" : "";
        return (
            <div className="modal-footer">
                <Button
                    style={{float:"right"}}
                    isDisabled={this.props.saveOptionsDisabled}
                    buttonType="default"
                    title="Continue to Launch"
                    onTouch={this.props.onSaveAdvanced}
                />
                <Button
                    tooltip={{
                        title: "Warning, any changes to Advanced Options will be lost",
                        placement: "top"
                    }}
                    style={{
                        marginRight:"10px",
                        float:"right"
                    }}
                    icon="refresh"
                    buttonType="link"
                    title="Restore Advaced Options"
                    onTouch={this.props.onClearAdvanced}
                />
            </div>
        )
    }
});
