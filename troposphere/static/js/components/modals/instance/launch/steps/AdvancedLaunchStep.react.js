import React from 'react/addons';
import modals from 'modals';
import stores from 'stores';
import BootScriptOption from '../components/BootScriptOption.react';
import AdvancedOptionsFooter from '../components/AdvancedOptionsFooter.react';

export default React.createClass({

    getInitialState: function() {
        let bootScripts = stores.ScriptStore.getAll();
        return {
            view: "BOOTSCRIPT_VIEW",
            options:[{
                    name: "Deployment Scripts", 
                    view: "BOOTSCRIPT_VIEW"
                },
                {
                    name: "Option 2", 
                    view: "OPTION2_VIEW"
                },
                {
                    name: "Option 3", 
                    view: "OPTION3_VIEW"
                }],

            bootScripts: {
                bootScripts,
                attachedScripts: []
            }
        }
    },

    updateState: function() {
        let bootScripts = stores.ScriptStore.getAll();
        this.setState({
            bootScripts: {
                ...this.state.bootScripts,
               bootScripts
            }
        });
    },

    componentDidMount: function() {
        debugger;
        console.log(this.state.bootScripts.bootScripts);
        stores.ScriptStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ScriptStore.removeChangeListener(this.updateState);
    },

    changeOption: function(item) {
        this.setState({
            view: item.view
        });
    },

    onSelectScript: function(value) {
        console.log(this.state.bootScripts.attachedScripts);
        let attachedScripts = this.state.bootScripts.attachedScripts;

        this.setState({
            bootScripts: {
                ...this.state.bootScripts,
                attachedScripts: [...attachedScripts, value]
            }
        });
    },

    onRemoveAttachedScript: function(item) {
        let attachedScripts = this.state.bootScripts.attachedScripts
                                .filter((i) => i != item);
        this.setState({
            bootScripts: {
                ...this.state.bootScripts,
                attachedScripts
            }
        });
    },

    renderBody: function() {
        let view = this.state.view;
        switch(view) {
            case "BOOTSCRIPT_VIEW":
            return this.renderBootScripts()
            case "OPTION2_VIEW":
            return this.renderOption2()
            case "OPTION3_VIEW":
            return this.renderOption3()
        }
    },

    renderOptions: function (item) {
        let title = item.name;
        let isActive = "";
        if (item.view == this.state.view) {
            isActive = "active";
        }
        return (
            <li className={`NavStacked-link ${isActive}`}>
            <a onClick={this.changeOption.bind(this, item)}>{title}</a></li>
        );
    },

    renderBootScripts: function() {
        debugger;
        if (this.state.bootScripts.bootScripts) {
            return (
                <BootScriptOption {...this.state.bootScripts}
                    onSelectScript={this.onSelectScript}
                    onRemoveAttachedScript={this.onRemoveAttachedScript}
                />
            );
        }
    },

    renderOption2: function() {
        return (
            "Option2"
        )
    },

    renderOption3: function() {
        return (
            "Option3"
        )
    },

    render: function() {
        let options = this.state.options.map(this.renderOptions);
        return (
            <div>
                <div className="AdvancedOptions">
                    <ul className="AdvancedOptions-optionList NavStacked">
                        {options}
                    </ul>
                    <div className="AdvancedOptions-content">
                        {this.renderBody()}
                    </div>
                </div>
                <AdvancedOptionsFooter
                    advancedOptionsDisabled={false}
                    cancel={this.props.cancelAdvanced}
                />
            </div>
        )
    }
});
