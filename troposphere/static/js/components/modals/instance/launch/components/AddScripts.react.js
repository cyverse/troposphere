import React from 'react/addons';
import SelectMenu from 'components/common/ui/SelectMenu.react';
import ScriptTags from './ScriptTags.react';

export default React.createClass({

    render: function() {
        let scriptName = function(item) { return item.get('title') };
        return (
            <div>
                <p style={{marginBottom:"50px"}}>
                    Deployment scripts will be executed when a user has launched their instance. They will also be executed each time an instance is "Started", "Resumed", or "Restarted". As such, these scripts should be able to handle being run multiple times without adverse effects.
                </p>
                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Add Scripts to Your Instance</label>
                        <hr/>
                        <div className="form-group">
                            <SelectMenu
                                hintText="Select scripts to add to your instance"
                                optionName = {scriptName}
                                list={this.props.bootScriptOption.bootScriptList}
                                onSelectChange={this.props.onAddAttachedScript}
                            />
                        </div>
                        <div style={{textAlign:"center", marginBottom:"20px"}}>- OR -</div>
                        <a className="btn btn-default btn-block"
                            onClick={this.props.onCreateScript}
                        >
                            Create a New Script
                        </a>
                    </div>
                    <div className="col-md-6">
                        <label>These Scripts will be Added</label>
                        <hr/>
                        <ScriptTags
                            scripts={this.props.bootScriptOption.attachedScripts}
                            onRemove={this.props.onRemoveAttachedScript}
                        />
                    </div>
                </div>
            </div>
        );
    }
});

