import React from "react";
import MenuItem from 'material-ui/MenuItem';
import ButtonMenu from 'cyverse-ui/ButtonMenu';
import Backbone from "backbone";
import modals from "modals";

export default React.createClass({
    displayName: "SubMenu",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onCreateExternalLink: function() {
        //TODO: Add initial_text if that makes sense.
        var initial_text = "";
        modals.ExternalLinkModals.createAndAddToProject(initial_text, this.props.project);
    },

    onCreateVolume: function() {
        modals.VolumeModals.createAndAddToProject({
            project: this.props.project
        });
    },

    onCreateInstance: function() {
        modals.InstanceModals.createAndAddToProject({
            project: this.props.project
        });
    },
    
    onItemSelect(e,el) {
        e.preventDefault();
        switch (el.props.primaryText) {
            case "Instance": this.onCreateInstance();
            break;
            case "Volume": this.onCreateVolume();
            break;
            case "Link": this.onCreateExternalLink();
            break;
        }
    },
    
    render: function() {
        return (
            <ButtonMenu
                style={{ marginRight: "10px" }}
                primary
                buttonLabel="New"
                onItemTouchTap={ this.onItemSelect }
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}        
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
            >
                <MenuItem
                    id="res-create-instance"
                    primaryText="Instance"
                />
                <MenuItem
                    id="res-create-volume"
                    primaryText="Volume"
                />
                <MenuItem
                    id="res-create-link"
                    primaryText="Link"
                />
            </ButtonMenu>
        );
    }
});
