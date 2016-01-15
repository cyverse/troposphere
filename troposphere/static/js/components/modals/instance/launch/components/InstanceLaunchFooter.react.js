import React from 'react';

export default React.createClass({
    render: function() {
        var launchIsDisabled = this.props.launchIsDisabled ? "disabled" : "";
        let advancedIsDisabled = this.props.advancedIsDisabled ? "disabled" : "";
        return (
            <div className="modal-footer">

                <a className="btn btn-default pull-left"
                    style={{marginRight:"10px"}}
                    onClick={this.props.onBack}
                >
                    <span className="glyphicon glyphicon-arrow-left"/> Back
                </a>

                <a className={`pull-left btn ${advancedIsDisabled}`}
                    onClick={this.props.viewAdvanced}>
                        <i className="glyphicon glyphicon-cog"/>
                        Advanced Options
                </a>

                <button
                    type="button"
                    className={`btn btn-primary pull-right ${launchIsDisabled}`}
                    onClick={this.props.onSubmitLaunch}
                >
                    Launch Instance
                </button>

                <button type="button" 
                    className="btn btn-default pull-right" 
                    style={{marginRight:"10px"}} 
                    onClick={this.props.cancel}
                >
                        Cancel
                </button>
            </div>
        )
    }
});
