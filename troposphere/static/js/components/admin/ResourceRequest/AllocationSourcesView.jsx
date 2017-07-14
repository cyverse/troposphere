import React from "react";

import ProgressBar from "components/common/ui/ProgressBar";

export default React.createClass({

    propTypes: {
        allocationSources: React.PropTypes.array.isRequired,
        onAllocationChange: React.PropTypes.func.isRequired
    },

    renderEditableAllocation(allocationSource) {
        let { name } = allocationSource;
        let props = {
            allocationSource,
            onAllocationChange: this.props.onAllocationChange
        }
        return (
        <AllocationEditableView key={name} { ...props } />
        );
    },

    render() {
        let { allocationSources } = this.props;

        let body = "There are no allocations.";
        if (allocationSources.length) {
            body = allocationSources.map(this.renderEditableAllocation);
        }

        return (
        <div>
            { body }
        </div>
        );
    }
});

var AllocationEditableView = React.createClass({

    propTypes: {
        allocationSource: React.PropTypes.object.isRequired,
        onAllocationChange: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            isEditing: false
        }
    },

    renderEditIcon() {
        let { isEditing } = this.state;
        return (
        <span style={{margin:"0 5px"}}
            onClick={() => this.setState({ isEditing: !isEditing })}
            className="glyphicon glyphicon-pencil" />
        );
    },

    onInputChange(e) {
        let { id } = this.props.allocationSource;
        let compute_allowed = +e.target.value;
        this.props.onAllocationChange({ id, compute_allowed });
    },

    renderAllocationInput(num) {
        let style = {
            margin:"0 5px"
        }
        return (
        <input style={style}
               onChange={this.onInputChange}
               type="number"
               value={num} />
        );
    },

    render() {
        let {
            allocationSource: {
                compute_used: consumed,
                compute_allowed,
                name
            }
        } = this.props;
        let { isEditing } = this.state;


        let percent = 0;
        let total = 0;
        // Prevent division by 0
        if (compute_allowed !== 0) {

            // Note: Multiplying/rounding to get 2 decimal places
            percent = Math.round((consumed / compute_allowed * 100) * 100) / 100;

            total = compute_allowed;
        }

        // Render total as an input field
        if (isEditing) {
            total = this.renderAllocationInput(compute_allowed);
        }

        let allocationLabel = (
        <span>
             { `${percent}% used of ` }
             { total }
             { ` Allocation from ${name}` }
             { this.renderEditIcon() }
        </span>
        )

        return (
        <ProgressBar startColor="#56AA21" startValue={percent} label={allocationLabel} />
        );
    }
});
