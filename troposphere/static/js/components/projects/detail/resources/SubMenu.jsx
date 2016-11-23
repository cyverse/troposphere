import React from "react";
import Backbone from "backbone";
import context from "context";
import modals from "modals";

import { trackAction } from 'utilities/userActivity';


export default React.createClass({
    displayName: "SubMenu",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onCreateExternalLink: function(e) {
        e.preventDefault();
        //TODO: Add initial_text if that makes sense.
        var initial_text = "";
        modals.ExternalLinkModals.createAndAddToProject(initial_text, this.props.project);
    },

    onCreateVolume: function(e) {
        e.preventDefault();
        modals.VolumeModals.createAndAddToProject({
            project: this.props.project
        });
    },

    onCreateInstance: function(e) {
        e.preventDefault();
        modals.InstanceModals.createAndAddToProject({
            project: this.props.project
        });
    },

    onExpiredPassword: function(e) {
        e.preventDefault();
        modals.ExpiredPasswordModals.show();
        trackAction("shown-expired-password-info", {});
    },

    render: function() {
        let expiredBadge = null,
            dropdownMenu;

        dropdownMenu = (
            <ul className="dropdown-menu">
                <li>
                    <a id="res-create-instance" href="#"
                       onClick={this.onCreateInstance}>
                        <i className={'glyphicon glyphicon-tasks'} /> Instance</a>
                </li>
                <li>
                    <a id="res-create-volume" href="#"
                       onClick={this.onCreateVolume}>
                        <i className={'glyphicon glyphicon-hdd'} /> Volume</a>
                </li>
                <li>
                    <a id="res-create-link" href="#"
                       onClick={this.onCreateExternalLink}>
                        <i className={'glyphicon glyphicon-globe'} /> Link</a>
                </li>
            </ul>
        );


        if (context && context.hasExpiredPassword()) {
            let style = {
                position: "absolute",
                top: "-5px",
                left: "-5px",
                color: "red",
                background: "white",
                borderRadius: "50%",
                marginRight: "3px"
            };
            expiredBadge = (
                <i className="glyphicon glyphicon-exclamation-sign" style={style} />
            );
            dropdownMenu = (
                <ul className="dropdown-menu">
                    <li>
                        <a id="res-create-instance" href="#"
                           onClick={this.onExpiredPassword}>
                            <i className={'glyphicon glyphicon-exclamation-sign'} />
                            Expired Password</a>
                    </li>
                </ul>
            );
        }

        return (
        <div className="sub-menu">
            <div className="dropdown">
                <button id="res-new-menu"
                        className="btn btn-primary dropdown-toggle"
                        data-toggle="dropdown">
                    New
                </button>
                {expiredBadge}
                {dropdownMenu}
            </div>
        </div>
        );
    }
});
