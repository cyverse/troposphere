import React from 'react';
import modals from 'modals';
import stores from 'stores';
import BootScriptOption from '../components/BootScriptOption.react';
import AdvancedOptionsFooter from '../components/AdvancedOptionsFooter.react';

export default React.createClass({

    getInitialState: function() {
        return {
            view: "BOOTSCRIPT_VIEW",
            footerDisabled: false,

            options:[
                {
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
                }
            ],
        }
    },

    changeOption: function(item) {
        this.setState({
            view: item.view
        });
    },


    onDisableFooter: function() {
        this.setState({
            footerDisabled: true,
        })
    },

    onEnableFooter: function() {
        this.setState({
            footerDisabled: false,
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

    renderOptions: function (item, i) {
        let title = item.name;
        let isActive = "";
        if (item.view == this.state.view) {
            isActive = "active";
        }
        return (
            <li key={i}className={`NavStacked-link ${isActive}`}>
                <a onClick={this.changeOption.bind(this, item)}>
                    {title}
                </a>
            </li>
        );
    },

    renderBootScripts: function() {
            return (
                <BootScriptOption {...this.props}
                    onDisableFooter={this.onDisableFooter}
                    onEnableFooter={this.onEnableFooter}
                />
            );
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

    renderOptionList: function() {
        if (this.state.options.length <= 1) { return };
        let options = this.state.options.map(this.renderOptions);
        return (
            <ul className="AdvancedOptions-optionList NavStacked">
                {options}
            </ul>
        )
    },

    render: function() {
        return (
            <div>
                <div className="AdvancedOptions">
                {/* If we only have one option rederOptionList can be commented out.
                    The content will resize to fill the whole modal.
                    This flexability will allow us to easily animate the width of RenderOptionList,
                    allowing the user to toggle the side bar open or closed for more room. */}
                    {this.renderOptionList()}
                    <div className="AdvancedOptions-content">
                        {this.renderBody()}
                    </div>
                </div>
                <AdvancedOptionsFooter
                    continueToLaunch={this.state.continueToLaunch}
                    clearOptionsIsDisabled={!this.props.hasAdvancedOptions}
                    footerDisabled={this.state.footerDisabled}
                    onSaveAdvanced={this.props.onSaveAdvanced}
                    onClearAdvanced={this.props.onClearAdvanced}
                />
            </div>
        )
    }
});
