import React from "react";
import Backbone from "backbone";
import modals from "modals";


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

    render: function() {
        return (
        <div className="sub-menu">
            <div className="dropdown">
                <button id="res-new-menu" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                    New
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <a id="res-create-instance" href="#" onClick={this.onCreateInstance}><i className={'glyphicon glyphicon-tasks'} /> Instance</a>
                    </li>
                    <li>
                        <a id="res-create-volume" href="#" onClick={this.onCreateVolume}><i className={'glyphicon glyphicon-hdd'} /> Volume</a>
                    </li>
                    <li>
                        <a id="res-create-link" href="#" onClick={this.onCreateExternalLink}><i className={'glyphicon glyphicon-globe'} /> Link</a>
                    </li>
                </ul>
            </div>
        </div>
        );
    }
});
