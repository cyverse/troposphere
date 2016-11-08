import React from "react";
import Backbone from "backbone";
import Gravatar from "components/common/Gravatar.react";
import MediaCard from "components/common/ui/MediaCard.react";
import AvailabilityView from "../availability/AvailabilityView.react";
import CryptoJS from "crypto-js";
import stores from "stores";
import globals from "globals";
import moment from "moment";
import showdown from "showdown";


export default React.createClass({
    displayName: "Version",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        version: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onEditClicked: React.PropTypes.func,
        editable: React.PropTypes.bool,
        showAvailability: React.PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            showAvailability: true,
            editable: true
        }
    },

    onEditClicked: function() {
        return this.props.onEditClicked(this.props.version);
    },

    renderAvailability: function() {
        var version = this.props.version;
        if (!this.props.showAvailability) {
            return;
        }

        return (
        <AvailabilityView version={version} />
        );
    },

    renderEditLink: function() {
        //NOTE: Undefined/null/etc. defaults to "TRUE" case.
        if (this.props.editable == false) {
            return;
        }

        let profile = stores.ProfileStore.get();
        let version = this.props.version;
        let image = this.props.image;

        if (!profile.id || !profile.get("username")) {
            return;
        }
        var username = profile.get("username");
        //TODO: Bring up discrepencies in the API here..
        if (username === version.get("user").username
            || username === image.get("created_by").username
            || profile.get("is_staff")) {
            return (
            <div>
                <a onClick={this.onEditClicked}>
                    <span className="glyphicon glyphicon-pencil" />
                    { " Edit Version" }
                </a>
            </div>
            )
        }
    },

    renderDateString: function(version) {
        let date_str;
        let dateCreated = moment(version.get("start_date"))
                .tz(globals.TZ_REGION)
                .format("MMM Do YY, hh:mm");

        if (version.get("end_date")) {
            let dateArchived = moment(version.get("end_date"))
                .tz(globals.TZ_REGION)
                .format("MMM Do YY, hh:mm");

            date_str = dateCreated + " - " + dateArchived;
        } else {
            date_str = dateCreated;
        }
        return date_str;

    },

    render: function() {
        // todo: figure out if anything is ever recommended, or if it's just a concept idea
        let { version, image } = this.props;
        let style = this.style();

        let versionHash = CryptoJS.MD5(version.id.toString()).toString();
        let type = stores.ProfileStore.get().get("icon_set");
        let owner = image.get("created_by").username;
        let changeLog = version.get("change_log");
        let converter = new showdown.Converter();
        let changeLogHTML = converter.makeHtml(changeLog);

        let subheading =  (
            <span>
                { `${this.renderDateString(version)} by ${owner}` }
                { this.renderEditLink() }
            </span>
        );
        return (
            <MediaCard
                title={ version.get("name") }
                subheading={ subheading }
                avatar={
                    <Gravatar
                        hash={versionHash}
                        size={40}
                        type={type}
                    />
                }
                description={
                    <div
                        style={ style.content }
                    >
                        <div style={ style.description }
                            dangerouslySetInnerHTML={{ __html: changeLogHTML }}
                        />
                        <div style={ style.availability }
                        >
                            { this.renderAvailability() }
                        </div>
                    </div>
                }
            />
        );
    },

    style() {
        return {
            content: {
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
            },

            description: {
                marginRight: "40px"
            },

            availability: {
                fontSize: "12px",
                width: "30%",
                minWidth: "220px",
                marginRight: "30px",
            },
        };
    }
});
