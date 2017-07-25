import React from "react";

import globals from "globals";
import ProgressBar from "components/common/ui/ProgressBar";

export default React.createClass({

    propTypes: {
        allocationSources: React.PropTypes.array.isRequired,
        onAllocationChange: React.PropTypes.func.isRequired
    },

    renderAllocation(allocationSource) {
        let { name } = allocationSource;
        let props = {
            allocationSource,
            onAllocationChange: this.props.onAllocationChange
        }
        if (globals.EXTERNAL_ALLOCATION) {
            return (
            <AllocationView key={name} { ...{ allocationSource } } />
            );
        }
        return (
        <AllocationEditableView key={name} { ...props } />
        );
    },

    render() {
        let { allocationSources } = this.props;

        let body = "There are no allocations.";
        if (allocationSources.length) {
            body = allocationSources.map(this.renderAllocation);
        }

        return (
        <div>
            { body }
        </div>
        );
    }
});

class AllocationView extends React.Component {
    getUsage() {
        let {
            allocationSource: { compute_used, compute_allowed }
        } = this.props;

        let percent = 0;
        let total = 0;
        // Prevent division by 0
        if (compute_allowed !== 0) {

            // Note: Multiplying/rounding to get 2 decimal places
            percent = Math.round((compute_used / compute_allowed * 100) * 100) / 100;

            total = compute_allowed;
        }

        return { percent, total };
    }

    render() {
        let { allocationSource: { name } } = this.props;
        let { percent, total } = this.getUsage();

        let allocationLabel = (
        <span>
             { `${percent}% used of ${total} Allocation from ${name}` }
        </span>
        );

        return (
        <ProgressBar startColor="#56AA21" startValue={percent} label={allocationLabel} />
        );
    }
}

AllocationView.propTypes = {
    allocationSource: React.PropTypes.object.isRequired
}

class AllocationEditableView extends AllocationView {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false
        };
    }

    renderEditIcon() {
        let { isEditing } = this.state;
        return (
        <span style={{margin:"0 5px"}}
            onClick={() => this.setState({ isEditing: !isEditing })}
            className="glyphicon glyphicon-pencil" />
        );
    }

    onInputChange({ target: { value }}) {
        let { id } = this.props.allocationSource;
        let compute_allowed = +value;
        this.props.onAllocationChange({ id, compute_allowed });
    }

    renderEditableField(num) {
        let style = {
            margin:"0 5px"
        }
        return (
        <input style={style}
               onChange={this.onInputChange.bind(this)}
               type="number"
               value={num} />
        );
    }

    render() {
        let { allocationSource: { name } } = this.props;
        let { isEditing } = this.state;
        let { percent, total } = this.getUsage();
        let editableTotal =
            isEditing
            ? this.renderEditableField(total)
            : total;

        let allocationLabel = (
        <span>
             { `${percent}% used of ` }
             { editableTotal }
             { ` Allocation from ${name}` }
             { this.renderEditIcon() }
        </span>
        );

        return (
        <ProgressBar startColor="#56AA21" startValue={percent} label={allocationLabel} />
        );
    }
}

AllocationEditableView.propTypes = {
    onAllocationChange: React.PropTypes.func.isRequired
}
