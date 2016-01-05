import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';

export default React.createClass({
    render: function() {
        return (
            <div>
                <div className="ProgressBar">
                    <p className="t-Caption">{this.props.label}</p>
                    <div className="ProgressBar-wrapper clearfix"
                        style={{background:"#efefef", marginBottom:"20px"}}>

                        <div className="ProgressBar-startIndicator"
                            style={{
                                height:"10px",
                                float: "left",
                                width:this.props.startValue,
                                background:this.props.startColor}}/>

                        <div className="ProgressBar-afterIndicator"
                            style={{
                                height:"10px",
                                float: "left",
                                width:this.props.afterValue,
                                background:this.props.startColor,
                                opacity:".5"}}/>
                    </div>
                </div>
            </div>
        );
    }
});
