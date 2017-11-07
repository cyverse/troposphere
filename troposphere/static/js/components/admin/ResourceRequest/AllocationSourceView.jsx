import React from "react";

import globals from "globals";
import ProgressBar from "components/common/ui/ProgressBar";

export default React.createClass({

    propTypes: {
        allocationSource: React.PropTypes.object.isRequired,
        onSave: React.PropTypes.func.isRequired
    },

    renderAllocation(allocationSource) {
        let { name } = allocationSource.pick("name");
        let { onSave } = this.props;
        if (globals.EXTERNAL_ALLOCATION) {
            return (
            <AllocationView key={name} { ...{ allocationSource } } />
            );
        }
        let props = { allocationSource, onSave };
        return (
        <AllocationEditableSaveableView key={name} { ...props } />
        );
    },

    render() {
        let { allocationSource } = this.props;

        return (
        <div>
            { this.renderAllocation(allocationSource) }
        </div>
        );
    }
});

class AllocationView extends React.Component {
    getUsage(allocation) {
        let { compute_used, compute_allowed } = allocation.pick(["compute_used", "compute_allowed"]);
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
        let { percent, total } = this.getUsage(this.props.allocationSource);
        let { name } = this.props.allocationSource.pick("name");

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
        <span style={{margin:"0 5px", cursor: "pointer" }}
            onClick={() => this.setState({ isEditing: !isEditing })}
            className="glyphicon glyphicon-pencil" />
        );
    }

    onInputChange({ target: { value }}) {
        let id = this.props.allocationSource.get("id");
        let compute_allowed = +value;
        this.props.onChange({ id, compute_allowed });
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
        let { name } = this.props.allocationSource.pick("name");
        let { isEditing } = this.state;
        let { percent, total } = this.getUsage(this.props.allocationSource);
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
    onChange: React.PropTypes.func.isRequired
}

class AllocationEditableSaveableView extends AllocationView {
    constructor(props) {
        super(props);
        this.state = {
            // TODO change allocationSource to alllocation
            allocationSource: props.allocationSource.clone(),
            isEditing: false,
            isPending: false,
            mounted: true
        };
    }

    componentWillUnmount() { this.state.mounted = false; }

    componentWillReceiveProps({ allocationSource }) {
        this.setState({ allocationSource: allocationSource.clone() });
    }

    renderEditIcon() {
        let { isEditing } = this.state;
        return (
        <span style={{margin:"0 5px", cursor: "pointer" }}
            onClick={() => this.setState({ isEditing: !isEditing })}
            className="glyphicon glyphicon-pencil" />
        );
    }

    onInputChange({ target: { value }}) {
        let { allocationSource } = this.state;
        allocationSource.set("compute_allowed", +value);
        this.setState({ allocationSource });
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

    onSave() {
       let { allocationSource } = this.state;
        // Clone our allocationSource, so that call to props.onSave doesn't affect our
        // state
        let clone = allocationSource.clone()
        this.setState({ isPending: true });
        this.props.onSave(clone)
            .then(this.resetPending.bind(this))
            .catch(this.resetPending.bind(this));
    }

    resetPending() {
        if (this.state.mounted) {
            this.setState({ isPending: false })
        }
    }

    renderSaveText() {
        let { isPending } = this.state;
        let buttonText = isPending ? "loading" : "save";
        return <span> <a style={{ float: "right" }} onClick={ this.onSave.bind(this) }>{ buttonText }</a></span>;
    }

    render() {
        let { allocationSource: cloudAllocation } = this.props;
        let { isEditing, isPending, allocationSource } = this.state;
        let { percent, total } = this.getUsage(allocationSource);
        let { name } = this.props.allocationSource.pick("name");
        let editableTotal =
            isEditing
            ? this.renderEditableField(total)
            : total;

        let hasChanged =
            // Check if the cloud allocation and local allocation differ
            allocationSource.keys().some(attr => allocationSource.get(attr) !== cloudAllocation.get(attr));

        let statusElement = null;
        if (isPending) {
            statusElement = <span style={{ float: "right", margin: 0 }} className="loading-small"></span>;
        } else if (hasChanged) {
            statusElement = <span> <a style={{ float: "right" }} onClick={ this.onSave.bind(this) }>save</a></span>;
        }

        let allocationLabel = (
        <span>
             { `${percent}% used of ` }
             { editableTotal }
             { ` Allocation from ${name}` }
             { this.renderEditIcon() }
             { statusElement }
        </span>
        );

        return (
        <ProgressBar startColor="#56AA21" startValue={percent} label={allocationLabel} />
        );
    }
}

AllocationEditableSaveableView.propTypes = {
    onSave: React.PropTypes.func.isRequired
}


