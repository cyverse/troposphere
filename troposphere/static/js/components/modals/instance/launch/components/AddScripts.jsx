import React from "react";
import SelectMenu from "components/common/ui/SelectMenu";
import ScriptTags from "./ScriptTags";

export default React.createClass({
    displayName: "AddScripts",

    propTypes: {
        onAddAttachedScript: React.PropTypes.func,
        onCreateScript: React.PropTypes.func,
        onRemoveAttachedScript: React.PropTypes.func
    },

    render: function() {
        return (
        <div>
            <p style={{ marginBottom: "50px" }}>
                Deployment scripts will be executed when a user has launched their instance. They will also be executed each time an instance is "Started", "Resumed", or "Restarted".
                As such, these scripts should be able to handle being run multiple times without adverse effects.
            </p>
            <div className="row">
                <div className="col-md-6 form-group">
                    <label>
                        Add Scripts to Your Instance
                    </label>
                    <hr/>
                    <div className="form-group">
                        <SelectMenu current={null}
                            placeholder="Select scripts to add to your instance"
                            optionName={s => s.get("title")}
                            list={this.props.bootScriptList}
                            onSelect={this.props.onAddAttachedScript} />
                    </div>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        - OR -
                    </div>
                    <a className="btn btn-default btn-block" onClick={this.props.onCreateScript}>Create a New Script</a>
                </div>
                <div className="col-md-6">
                    <label>
                        These Scripts will be Added
                    </label>
                    <hr/>
                    <ScriptTags scripts={this.props.attachedScripts} onRemove={this.props.onRemoveAttachedScript} />
                </div>
            </div>
        </div>
        );
    }
});

