import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';

export default React.createClass({
    propTypes: {
        startValue: React.PropTypes.number,
        afterValue: React.PropTypes.number,
        startColor: React.PropTypes.string,
        label: React.PropTypes.string,
        maxColor: React.PropTypes.string
    },

    render: function() {
        let startValue = this.props.startValue;
        let afterValue = this.props.afterValue;
        let startColor = this.props.startColor;
        let maxColor = this.props.maxColor ?
            this.props.maxColor : "red";

        // Makes the progress bar red if either of the values or the total of both are 100% or more.
        if (startValue >= 100) {
            startValue = 100;
            startColor = maxColor;
        }

        if (startValue + afterValue >= 100) {
            afterValue = 100 - startValue;
            startColor = maxColor;
        }

        return (
            <div>
                <div className="ProgressBar">
                    <p className="t-Caption">{this.props.label}</p>
                    <div className="ProgressBar-wrapper clearfix"
                        style={{background:"#efefef", marginBottom:"20px"}}>

                        <div className="ProgressBar-startIndicator"
                            style={{
                                height: "10px",
                                float: "left",
                                width: startValue + "%",
                                background: startColor
                            }}
                        />

                        <div className="ProgressBar-afterIndicator"
                            style={{
                                height: "10px",
                                float: "left",
                                width: afterValue + "%",
                                background: startColor,
                                opacity: ".5"
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
});
