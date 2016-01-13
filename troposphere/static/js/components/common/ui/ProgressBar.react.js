import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';

export default React.createClass({
    render: function() {
        let startValue = this.props.startValue;
        let afterValue = this.props.afterValue;
        let startColor = this.props.startColor;

        if (startValue >= 100) {
            startValue = 100;
            startColor = "red";
        }

        if (startValue + afterValue >= 100) {
            afterValue = 100 - startValue;
            startColor = "red";
        }

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
                                width: startValue + "%",
                                background:startColor}}/>

                        <div className="ProgressBar-afterIndicator"
                            style={{
                                height:"10px",
                                float: "left",
                                width: afterValue + "%",
                                background:startColor,
                                opacity:".5"}}/>
                    </div>
                </div>
            </div>
        );
    }
});
