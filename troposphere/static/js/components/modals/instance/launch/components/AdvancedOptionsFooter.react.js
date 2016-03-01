import React from 'react';

export default React.createClass({
    render: function() {
        let saveOptionsDisabled = this.props.saveOptionsDisabled ? "disabled" : "";
        return (
            <div className="modal-footer">
                <button type="button"
                    disabled={this.props.saveOptionsDisabled}
                    className="btn btn-primary pull-right"
                    onClick={this.props.onSaveAdvanced}
                >
                    Save Advanced Options
                </button>
                <button type="button"
                    className="btn btn-default pull-right"
                    style={{marginRight:"10px"}}
                    onClick={this.props.cancel}
                >
                        Cancel Advanced Options
                </button>
            </div>
        )
    }
});
