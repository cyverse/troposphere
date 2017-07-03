import React from "react";
import subscribe from "utilities/subscribe";
import CreateScript from "components/common/boot_script/CreateScript";
import EditScript from "components/common/boot_script/EditScript";
import globals from "globals";

const BootScriptListView = React.createClass({

    getInitialState: function() {
        return {
            showCreateForm: false,
            showEditForm: false,
            editScript: null,
        };
    },

    hideEditForm: function() {
        this.setState({showEditForm: false, editScript: null});
    },

    showEditForm: function(bootScript) {
        console.log("New state: Edit script " + bootScript.get('title'));
        this.setState({showEditForm: true, editScript: bootScript});
    },

    hideCreateForm: function() {
        this.setState({showCreateForm: false});
    },

    showCreateForm: function() {
        this.setState({showCreateForm: true});
    },

    onUpdateBootScript: function(bootScript) {
        this.hideEditForm();
        // Do something?
    },
    onCreateBootScript: function(bootScript) {
        this.hideCreateForm();
        // Do something?
    },
    editBootScript: function(bootScript) {
        this.hideCreateForm();
        this.showEditForm(bootScript);

    },
    destroyBootScript: function(bootScript) {

        // EmitChange is responsible for triggering the rerender, which
        // happens after the network request.

        // Optimistically delete the key
        let {ScriptStore} = this.props.subscriptions;

        ScriptStore.remove(bootScript);
        bootScript.destroy({
            success: function() {
                ScriptStore.emitChange();
            },
            error: function() {
                // Re-add the key to store if delete failed
                ScriptStore.add(bootScript);
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

    renderBootScriptRow: function(bootScript) {
        let { td } = this.style();
        //NOTE: Key warning in tr (created by BootScriptListView) onCreate..?
        return (
        <tr key={bootScript.get("id")}>
            <td style={td}>
                {bootScript.get("title")}
            </td>
            <td style={td}>
                {bootScript.get("type")}
            </td>
            <td style={td}>
                {bootScript.get("strategy")}
            </td>
            <td>
                <a onClick={this.editBootScript.bind(this, bootScript)}><i className="glyphicon glyphicon-pencil" /></a>{" "}
                <a onClick={this.destroyBootScript.bind(this, bootScript)}><i style={{ color: "crimson" }} className="glyphicon glyphicon-trash" /></a>
            </td>
        </tr>
        );
    },
    renderEditForm: function() {
        if(!this.state.showEditForm) {
            return;
        }
        return (<div>
            <EditScript script={this.state.editScript} style={{}} close={this.hideEditForm} onSave={this.onUpdateBootScript} />
        </div>);
    },
    renderCreateForm: function() {
        if(this.state.showEditForm) {
            return;
        }
        if(!this.state.showCreateForm) {
            return (
                <a onClick={ this.showCreateForm }>
                   <i className="glyphicon glyphicon-plus" />
               </a>);
        }
        return (<div>
            <CreateScript style={{}} close={this.hideCreateForm} onCreate={this.onCreateBootScript} />
        </div>);
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
                                <th style={{ width: "60px"}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            { boot_scripts ? boot_scripts.map(this.renderBootScriptRow) : [] }
                            <tr>
                                <td>
                                    {this.renderCreateForm()}
                                    {this.renderEditForm()}
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

export default subscribe(BootScriptListView, ["ScriptStore",]);
