import React from "react";
import subscribe from "utilities/subscribe";
import globals from "globals";
import ModalHelpers from "components/modals/ModalHelpers";
import ScriptCreateModal from "components/modals/script/ScriptCreateModal";

const ScriptListView = React.createClass({

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

    style() {
        return {
            td: {
                wordWrap: "break-word",
                whiteSpace: "normal"
            }
        }
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
                {script.get("type")}
            </td>
            <td style={td}>
                {script.get("strategy")}
            </td>
            <td>
                <a onClick={this.editScript.bind(this, script)}><i className="glyphicon glyphicon-pencil" /></a>{" "}
                <a onClick={this.destroyScript.bind(this, script)}><i style={{ color: "crimson" }} className="glyphicon glyphicon-trash" /></a>
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
                <h3>Boot Scripts</h3>
                <div style={{maxWidth: "600px"}}>
                    <p>
                        Use the table below to create and/or edit existing
                        boot scripts. These scripts can be selected
                        when you launch an instance.
                    </p>
                </div>
                <div style={{maxWidth: "80%"}}>
                    <table className="clearfix table" style={{ tableLayout: "fixed" }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Boot Type</th>
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
