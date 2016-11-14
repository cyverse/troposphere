import React from "react";
import Breadcrumb from "./Breadcrumb";


export default React.createClass({
    displayName: "BreadcrumbNav",

    propTypes: {
        breadcrumbs: React.PropTypes.array.isRequired,
        //breadcrumb: React.PropTypes.object.isRequired,
        //step: React.PropTypes.number.isRequired,
        onCrumbClick: React.PropTypes.func.isRequired
    },

    renderCrumbs: function() {
        var onMouseOn = this.props.onMouseOn;
        var onMouseOff = this.props.onMouseOff;
        //var step = this.props.step;
        var self = this;

        //Counting # of 'actual' steps
        var activeStepCount = 0;
        var breadcrumbs = this.props.breadcrumbs.map(function(breadcrumb) {

            activeStepCount = activeStepCount + 1;
            var breadcrumbText = activeStepCount;
            return (
            <Breadcrumb key={breadcrumb.name}
                onMouseOn={onMouseOn}
                onMouseOff={onMouseOff}
                breadcrumb={breadcrumb}
                breadcrumbText={breadcrumbText}
                onClick={self.crumbClicked} />
            )
        });
        return breadcrumbs;
    },
    crumbClicked: function(breadcrumb) {
        if (breadcrumb.step < this.props.step) {
            this.props.onCrumbClick(breadcrumb);
        }
    },
    render: function() {

        return (
        <div className="breadcrumb">
            {this.renderCrumbs()}
        </div>
        );
    }
});
