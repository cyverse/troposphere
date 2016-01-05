import React from 'react';

export default React.createClass({
    render: function() {
        let saveAdvancedIsDisabled = this.props.saveAdvancedIsDisabled ? "disabled" : "";
        return (
            <div className="modal-footer">
                <button type="button" className={`btn btn-primary pull-right ${saveAdvancedIsDisabled}`}>
                    Save Advanced Options
                </button>
                <button type="button"
                    className="btn btn-default pull-right" style={{marginRight:"10px"}} onClick={this.props.cancel}>
                        Cancel Advanced Options
                </button>
            </div>
        )
    }
});
