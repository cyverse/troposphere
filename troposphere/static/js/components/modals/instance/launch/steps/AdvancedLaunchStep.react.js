import React from 'react/addons';
import modals from 'modals';
import stores from 'stores';
import BootScriptOption from '../components/BootScriptOption.react';
import AdvancedOptionsFooter from '../components/AdvancedOptionsFooter.react';

export default React.createClass({

    getInitialState: function() {
        return {
            view: "BOOTSCRIPT_VIEW",
            saveOptionsDisabled: false,
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
        }
    },

    changeOption: function(item) {
        this.setState({
            view: item.view
        });
    },


    onDisableSave: function() {
        this.setState({
            saveOptionsDisabled: true
        })
    },

    onEnableSave: function() {
        this.setState({
            saveOptionsDisabled: false
        })
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
        if (this.props.bootScriptOption.bootScriptList) {
            return (
                <BootScriptOption {...this.props}
                    onDisableSave={this.onDisableSave}
                    onEnableSave={this.onEnableSave}
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
                    saveOptionsDisabled={this.state.saveOptionsDisabled}
                    onSaveAdvanced={this.props.onSaveAdvanced}
                    cancel={this.props.cancelAdvanced}
                />
            </div>
        )
    }
});
