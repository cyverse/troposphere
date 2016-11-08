import React from "react";
import modals from "modals";

import { ButtonMenu, MenuItem } from 'cyverse-ui';

export default React.createClass({
    displayName: "NewResourceButton",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState() {
        return {
            isOpenNewMenu: false,
        }
    },

    onToggleNewMenu() {
       let isOpenNewMenu = this.state.isOpenNewMenu ?
            false : true;
       this.setState({ 
           isOpenNewMenu
       })
    },

     onCreateExternalLink: function(e) {
        e.preventDefault();
        this.onToggleNewMenu();
        //TODO: Add initial_text if that makes sense.
        var initial_text = "";
        modals.ExternalLinkModals.createAndAddToProject(initial_text, this.props.project);
    },

    onCreateVolume: function(e) {
        e.preventDefault();
        this.onToggleNewMenu();
        modals.VolumeModals.createAndAddToProject({
            project: this.props.project
        });
    },

    onCreateInstance: function(e) {
        e.preventDefault();
        this.onToggleNewMenu();
        modals.InstanceModals.createAndAddToProject({
            project: this.props.project
        });
    },

    render() {

        return (
            <ButtonMenu
                color={ THEME.color.primary }
                buttonLabel="New"
                onItemTouchTap={ this.onToggleNewMenu }
                onTouch={ this.onToggleNewMenu }
                isOpen={ this.state.isOpenNewMenu }
            >
                <MenuItem 
                    onTouchTap={ this.onCreateInstance }
                    primaryText="Instance" 
                />
                <MenuItem 
                    onTouchTap={ this.onCreateVolume }
                    primaryText="Volume" 
                />
                <MenuItem            
                    onTouchTap={ this.onCreateExternalLink }
                    primaryText="Link" 
                />
            </ButtonMenu>
        );
    }
});
