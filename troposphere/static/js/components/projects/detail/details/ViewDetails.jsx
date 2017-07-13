import React from "react";
import Backbone from "backbone";
import Showdown from "showdown";

import globals from "globals";
import subscribe from "utilities/subscribe";
import featureFlags from "utilities/featureFlags";


const ViewDetails = React.createClass({
    displayName: "ViewDetails",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    // ------
    // Render
    // ------

    renderName: function(project) {
        return (
        <div className="project-info-segment row">
            <h4 className="t-body-2 col-md-3">Name</h4>
            <p className="col-md-9">
                {project.get("name")}
            </p>
        </div>
        );
    },

    renderDateCreated: function(project) {
        var start_date = project.get("start_date")
            .tz(globals.TZ_REGION)
            .format("MMM Do YYYY hh:mm a z");
        return (
        <div className="project-info-segment row">
            <h4 className="t-body-2 col-md-3">Created</h4>
            <p className="col-md-9">
                {start_date}
            </p>
        </div>
        );
    },

    renderDescription: function(project) {
        var converter = new Showdown.Converter(),
            description = project.get("description"),
            descriptionHtml = converter.makeHtml(description);

        return (
        <div className="project-info-segment row">
            <h4 className="t-body-2 col-md-3">Description</h4>
            <div className="col-md-9" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        </div>
        )
    },

    renderUsersText: function(group_users) {
        let group_users_text = group_users.map(function(user) {
            return user.username;
        });
        return group_users_text.join(", ");
    },
    renderLeaders: function(project) {
        let { GroupStore } = this.props.subscriptions;
        var group_id = project.get("owner").id,
            group = GroupStore.get(group_id);
        if(group == null) {
            return (
            <div className="project-info-segment row">
                <h4 className="t-body-2 col-md-3">Leaders</h4>
                <div className="loading" />
            </div>
            );
        }
        return (
        <div className="project-info-segment row">
            <h4 className="t-body-2 col-md-3">Leaders</h4>
            <div className="col-md-9">
                {this.renderUsersText(group.get("leaders"))}
            </div>
        </div>
        );
    },
    renderVisibility: function(project) {
        if (!featureFlags.hasProjectSharing()) {
            return;
        }
        let { GroupStore } = this.props.subscriptions,
            group_id = project.get("owner").id,
            group = GroupStore.get(group_id);

        if(group == null) {
            return (
            <div className="project-info-segment row">
                <h4 className="t-body-2 col-md-3">Visibility</h4>
                <div className="loading" />
            </div>
            );
        }

        let users = group.get('users'),
            usernames = this.renderUsersText(users),
            isPrivate = (users.length == 1),
            body = group.get('name');
        if(isPrivate) {
            body = body + " - Private";
        } else {
            body = body + " - Shared with " + usernames;
        }
        return (
        <div className="project-info-segment row">
            <h4 className="t-body-2 col-md-3">Visibility</h4>
            <div className="col-md-9">
                {body}
            </div>
        </div>
        );
    },

    render: function() {
        var project = this.props.project;

        return (
        <div>
            {this.renderName(project)}
            {this.renderDateCreated(project)}
            {this.renderDescription(project)}
            {this.renderVisibility(project)}
        </div>
        );
    }
});

export default subscribe(ViewDetails, ["GroupStore"]);
