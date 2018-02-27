import React from "react"
import Backbone from "backbone";

import RaisedButton from "material-ui/RaisedButton";

import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";
import InstanceModel from "models/Instance";


export default React.createClass({
    displayName: "BatchInstanceDeleteModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        instances: React.PropTypes.instanceOf(InstanceModel).isRequired,
        attachedVolumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        attachedResults: React.PropTypes.object.isRequired,
        onConfirm: React.PropTypes.func.isRequired,
    },

    confirm() {
        this.hide();
        this.props.onConfirm();
    },

    renderInstance(instance) {
        let instanceName = instance.get("name"),
            instanceId = instance.get("id");

        return (
            <li key={`inst-${instanceId}`}>
                <strong>
                    {`${instanceName} #${instanceId}`}
                </strong>
            </li>
        );
    },

    renderRejected(rejected) {
        let rejectedElements, subtree;

        if (rejected && rejected.length > 0) {
            rejectedElements = rejected.map(this.renderInstance);

            subtree = (
                <div>
                    <p className="alert alert-info">
                        <Glyphicon name="info-sign" />
                        {" "}<strong>NOTE</strong>
                        { " We cannot delete the instance(s) because they have " +
                          "attached volumes. " }
                    </p>
                    <h2 style={{marginBottom: "12px"}}
                        className="t-title">Instance(s) with Attached Volumes</h2>
                    <p>
                        {"If you "}<strong>wish</strong>{" to delete "}
                        {" these instance(s), then you "}
                        <strong>must</strong>
                        {" detach the volumes.  After they are detached, " +
                          "you may try again to delete them." }
                    </p>
                    <ul>
                        {rejectedElements}
                    </ul>
                </div>
            );
        }
        return subtree;
    },

    renderBody() {
        let { instances, rejected } = this.props,
            deleteElements;

        deleteElements = instances.map(this.renderInstance);

        return (
        <div>
            {this.renderRejected(rejected)}
            <hr />
            <p className="alert alert-danger">
                <Glyphicon name="warning-sign" />
                {" "}<strong>CAUTION</strong>
                {"  Data will be "}<strong>lost</strong>{"."}
            </p>
            <div>
                <h2 style={{marginBottom: "12px"}}
                    className="t-title">Affected Instances</h2>
                <p>
                    {"If you "}<strong>choose</strong>{" to proceed, "}
                    {"then following instance(s) will be " +
                     "will be terminated and all data will be permanently lost: "}
                </p>
                <ul>
                    {deleteElements}
                </ul>
            </div>

            <p style={{padding: "10px 0px 10px 0p", marginBottom: "5px"}}>
                <em>
                    Note:
                </em>
                {
                    " Your resource usage charts will not reflect changes until the " +
                    "instance is completely deleted and has disappeared " +
                    "from your list of instances."
                }
            </p>
        </div>
        );
    },

    render() {
        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">
                            Delete Instance(s)
                        </h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <RaisedButton
                            style={{ marginRight: "10px" }}
                            onTouchTap={this.hide}
                            label="Cancel"
                        />
                        <RaisedButton
                            primary
                            type="button"
                            onTouchTap={this.confirm}
                            label="Yes, delete instance(s)"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
