import React from "react";
import Backbone from "backbone";
import HeaderView from "./header/HeaderView";

import ViewImageDetails from "./ViewImageDetails";
import EditImageDetails from "./EditImageDetails";
import VersionsView from "./versions/VersionsView";
import ImageStatsView from "./stats/ImageStatsView";
import actions from "actions";
import context from "context";
import modals from "modals";

import { trackAction } from "../../../utilities/userActivity";


export default React.createClass({
    displayName: "ImageDetailsView",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection),
        identities: React.PropTypes.instanceOf(Backbone.Collection),
        allPatterns: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    getInitialState: function() {
        return {
            isEditing: false
        }
    },

    showLaunchModal: function(e) {
        modals.InstanceModals.launch({
            image: this.props.image,
            initialView: "BASIC_VIEW"
        });
        trackAction("launched-from-image-detail", {});
    },

    handleEditImageDetails: function() {
        this.setState({
            isEditing: true
        })
    },

    handleSaveImageDetails: function(newAttributes) {
        var image = this.props.image;
        actions.ImageActions.updateImageAttributes(image, newAttributes);
        this.setState({
            isEditing: false
        });
    },

    handleCancelEditing: function() {
        this.setState({
            isEditing: false
        });
    },

    render: function() {
        var view,
            statisticsView,
            versionView = (
                <VersionsView image={this.props.image} />
            );

        if (context.hasLoggedInUser()) {
            statisticsView = (
                <ImageStatsView image={ this.props.image } />
            );
        }

        if (this.state.isEditing) {
            view = (
                <EditImageDetails image={this.props.image}
                    tags={this.props.tags}
                    providers={this.props.providers}
                    identities={this.props.identities}
                    allPatterns={this.props.allPatterns}
                    onSave={this.handleSaveImageDetails}
                    onCancel={this.handleCancelEditing}
                />
            )
        } else {
            view = (
                <ViewImageDetails image={this.props.image}
                    tags={this.props.tags}
                    providers={this.props.providers}
                    identities={this.props.identities}
                    onEditImageDetails={this.handleEditImageDetails}
                />
            )
        }
        return (
            <div id="app-detail" className="container">
                <HeaderView image={this.props.image} />
                <div className="image-content">
                    <div style={{ marginBottom: "30px" }}>
                        {view}
                    </div>
                    <div className="versionView">
                        {versionView}
                    </div>
                    <div className="statisticsView">
                        {statisticsView}
                    </div>
                </div>
            </div>
        );
    }
});
