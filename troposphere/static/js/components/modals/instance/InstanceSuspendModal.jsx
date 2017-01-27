import React from "react";

import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";

import Instance from "models/Instance";


export default React.createClass({
    displayName: "InstanceSuspendModal",

    mixins: [BootstrapModalMixin],

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
        this.props.onConfirm();
    },

    //
    // Render
    // ------
    //

    renderBody: function(multiple, instances) {
        let operativeNoun = multiple ? "these instances": "this instance",
            instanceList = (<div/>);

        if (instances) {
            instanceList = (
            <div>
                <ul>
                {instances.map((i) => {
                    return (
                    <li key={i.get("uuid")}>
                        <strong>
                            {`${i.get("name")}`}
                        </strong>
                        <ul>
                            <li style={{listStyleType: "square"}}>
                                {`IP Address: ${i.get("ip_address")}`}
                            </li>
                        </ul>
                    </li>
                    );
                 })}
                </ul>
            </div>
            );
        }

        return (
        <div>
            <p className="alert alert-warning">
                <Glyphicon name="warning-sign" />
                {" "}
                <strong>WARNING</strong>
                {" Suspending an instance will freeze its state, and the " +
                 "IP address may change when you resume the instance."}
            </p>
            <p>
                {'Suspending an instance frees up resources for other users ' +
                 'and allows you to safely preserve the state of your ' +
                 'instance without imaging. '}
                {'Your time allocation no longer counts against you in the ' +
                 ' suspended mode.'}
            </p>
            <p>
                {'Your resource usage charts will only reflect the freed ' +
                 'resources once the instance\'s state is "suspended."'}
            </p>
            {instanceList}
            <p>
                {`Would you like to suspend ${operativeNoun}?`}
            </p>
        </div>
        );
    },

    render: function() {
        // AUTHOR'S NOTE - not sure if I should extract this filter predicate into
        // a utility function to be shared across the <Instance*Modal/>s ...
        let { resources } = this.props,
            instances = resources ? resources.filter((r) => r instanceof Instance) : null,
            multi = instances && instances.length > 1,
            titleNoun = multi ? "Instances" : "Instance",
            buttonText = multi ? "these instances" : "this instance";

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">{`Suspend ${titleNoun}`}</h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody(multi, instances)}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" onClick={this.cancel}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={this.confirm}>
                            {`Yes, suspend ${buttonText}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
