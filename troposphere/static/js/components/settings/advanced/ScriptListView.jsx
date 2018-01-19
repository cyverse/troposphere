import React from "react";
import subscribe from "utilities/subscribe";
import ModalHelpers from "components/modals/ModalHelpers";
import ScriptCreateModal from "components/modals/script/ScriptCreateModal";

const ScriptListView = React.createClass({

    getInitialState: function() {
        return {
            displayMoreInfo: false,
        };
    },

    style() {
        return {
            td: {
                wordWrap: "break-word",
                whiteSpace: "normal"
            }
        }
    },

    launchCreateScriptModal: function() {
        //Open modal, new script
        let props = {};
        ModalHelpers.renderModal(ScriptCreateModal, props, function() {
            //Do this on success.
        });
    },

    editScript: function(script) {
        //Open modal, pass in script
        let props = {
            script: script
        };
        ModalHelpers.renderModal(ScriptCreateModal, props, function() {
            //Do this on success.
        });
    },

    destroyScript: function(script) {

        // EmitChange is responsible for triggering the rerender, which
        // happens after the network request.

        // Optimistically delete the key
        let {ScriptStore} = this.props.subscriptions;

        ScriptStore.remove(script);
        script.destroy({
            success: function() {
                ScriptStore.emitChange();
            },
            error: function() {
                // Re-add the key to store if delete failed
                ScriptStore.add(script);
                ScriptStore.emitChange();
            }
        });
    },

    onDisplayMoreInfo(e) {
        let { displayMoreInfo } = this.state;
        e.preventDefault();
        this.setState({
            displayMoreInfo: !displayMoreInfo
        });
    },

    renderMoreInfo() {
        let { displayMoreInfo } = this.state;

        if (displayMoreInfo) {
            let dd = { paddingLeft: "25px" };

            return (
            <div>
                <p>
                    Deployment Scripts have extended functionality that our
                    community may wish to leverage in new instances or images.
                </p>
                <dl style={{margin: "5px 0 10px auto"}}>
                    <dt>Script Title</dt>
                    <dd style={dd}>name that will appear when selecting the deployment script</dd>
                    <dt>Execution Strategy Type</dt>
                    <dd style={dd}>
                        <u>Sync</u> - wait for script to complete, ensure
                        exit code 0, email me if there is a failure.
                    </dd>
                    <dd style={dd}>
                        <u>Async</u> - execute scripts asynchronously.
                        Store <code>stdout/stderr</code> to log files.
                    </dd>
                    <dt>Deployment Type</dt>
                    <dd style={dd}>
                        <u>Once</u> - run script on first boot
                    </dd>
                    <dd style={dd}>
                        <u>Always</u> - run script on every deployment
                    </dd>
                    <dt>Input Type</dt>
                    <dd style={dd}>
                        <u>URL</u> - import script using the provided URL
                    </dd>
                    <dd style={dd}>
                        <u>Text</u> - import script using provided text
                    </dd>
                </dl>
                <p>
                    Click to <a onClick={this.onDisplayMoreInfo}>hide</a> more information.
                </p>
            </div>
            )
        }

        return (
            <p>
                Click <a onClick={this.onDisplayMoreInfo}>here</a> to learn more.
            </p>
        );
    },

    renderScriptRow: function(script) {
        let { td } = this.style();

        // Set a key that lexicograhically sorts first by title then by cid.
        // Cannot sort by id, because recently created bootscript has no id
        let key = script.get("title") + script.cid;
        return (
        <tr key={key}>
            <td style={td}>
                {script.get("title")}
            </td>
            <td style={td}>
                <span style={{textTransform:"capitalize"}}>
                    {script.get("strategy")}
                </span>
            </td>
            <td style={td}>
                {script.get("wait_for_deploy") ? "Sync" : "Async" }
            </td>
            <td style={td}>
                {script.get("type")}
            </td>
            <td>
                <a onClick={this.editScript.bind(this, script)}>
                    <i className="glyphicon glyphicon-pencil" /></a>{" "}
                <a onClick={this.destroyScript.bind(this, script)}>
                    <i style={{ color: "crimson" }} className="glyphicon glyphicon-trash" /></a>
            </td>
        </tr>
        );
    },

    render: function() {
        let {ScriptStore} = this.props.subscriptions,
            boot_scripts = ScriptStore.getAll();

        if(boot_scripts == null) {
            return (<div className="loading"/>);
        }

        return (
            <div>
                <h3>Deployment Scripts (formerly Boot Scripts)</h3>
                <div style={{maxWidth: "600px"}}>
                    <p>
                        Use the table below to create and/or edit existing
                        deployment scripts. These scripts can be selected
                        when you launch an instance.
                    </p>
                    {this.renderMoreInfo()}
                </div>
                <div style={{maxWidth: "80%"}}>
                    <table className="clearfix table" style={{ tableLayout: "fixed" }}>
                        <thead>
                            <tr>
                                <th>Script Title</th>
                                <th>Execution Strategy Type</th>
                                <th>Deployment Type</th>
                                <th>Input Type</th>
                                <th style={{ width: "60px"}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            { boot_scripts ? boot_scripts.map(this.renderScriptRow) : [] }
                            <tr>
                                <td>
                                    <a onClick={ this.launchCreateScriptModal }>
                                        <i className="glyphicon glyphicon-plus" />
                                    </a>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

});

export default subscribe(ScriptListView, ["ScriptStore",]);
