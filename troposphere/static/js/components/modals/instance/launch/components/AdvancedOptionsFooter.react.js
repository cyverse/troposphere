import React from 'react';

export default React.createClass({

    propTypes: {
        onSaveAdvanced: React.PropTypes.func.isRequired,
        cancel: React.PropTypes.func.isRequired
    },

    render: function() {
        let saveOptionsDisabled = this.props.saveOptionsDisabled ? "disabled" : "";
        return (
            <div className="modal-footer">
                <button type="button"
                    className={`btn btn-primary pull-right ${saveOptionsDisabled}`}
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
