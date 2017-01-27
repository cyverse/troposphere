import React from "react";
import Backbone from "backbone";
import Showdown from "showdown";
import globals from "globals";
import stores from "stores";

export default React.createClass({
    displayName: "ViewDetails",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    componentDidMount: function() {
        stores.GroupStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.GroupStore.removeChangeListener(this.updateState);
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
        var group_id = project.get("owner").id,
            group = stores.GroupStore.get(group_id);
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
    renderMembers: function(project) {
        var group_id = project.get("owner").id,
            group = stores.GroupStore.get(group_id);
        if(group == null) {
            return (
            <div className="project-info-segment row">
                <h4 className="t-body-2 col-md-3">Members</h4>
                <div className="loading" />
            </div>
            );
        }
        return (
        <div className="project-info-segment row">
            <h4 className="t-body-2 col-md-3">Members</h4>
            <div className="col-md-9">
                {this.renderUsersText(group.get("users"))}
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
            {this.renderMembers(project)}
            {this.renderLeaders(project)}
        </div>
        );
    }
});
