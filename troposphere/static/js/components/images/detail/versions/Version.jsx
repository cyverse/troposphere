import React from "react";
import Backbone from "backbone";
import CryptoJS from "crypto-js";

import Gravatar from "components/common/Gravatar";
import Ribbon from "components/common/Ribbon";
import MediaCard from "components/common/ui/MediaCard";
import AvailabilityView from "../availability/AvailabilityView";
import { Pill } from 'cyverse-ui';

import stores from "stores";
import context from "context";
import globals from "globals";
import moment from "moment";
import showdown from "showdown";


export default React.createClass({
    displayName: "Version",

    getInitialState() {
        return {
            isOpen: false
        }
    },

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        version: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onEditClicked: React.PropTypes.func,
        editable: React.PropTypes.bool,
        showAvailability: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            showAvailability: true,
            editable: true
        }
    },

    onCardClick() {
        let isOpen = !this.state.isOpen;

        this.setState({
            isOpen
        });
    },

    onEditClicked(e) {
        e.stopPropagation();
        e.preventDefault();
        return this.props.onEditClicked(this.props.version);
    },

    renderAvailability() {
        let isOpen = this.state.isOpen;
        let version = this.props.version;
        if (!this.props.showAvailability) {
            return;
        }

        return (
        <AvailabilityView
            isSummary={ !isOpen }
            version={ version }
        />
        );
    },

    renderEditLink() {
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

    renderDateString(version) {
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

    renderChangeLog() {
        let { version } = this.props;
        let styles = this.styles();
        let changeLog = version.get("change_log");
        let converter = new showdown.Converter();
        let changeLogHTML = converter.makeHtml(changeLog);

        return (
        <div style={ styles.description }
            dangerouslySetInnerHTML={{
                __html: changeLogHTML
            }}
        />
       );
    },

    renderDocObjectId() {
        let { version } = this.props,
            hasDOI = version && version.hasDOI(),
            doi = version ? version.get("doc_object_id") : "",
            doiLink = null;

        if (hasDOI) {
            doiLink = (
                <a href={`https://doi.org/${doi}`}>{`${doi}`}</a>
            );
        }
        return (
            <div style={{marginBottom: "15px"}}>
                <strong>{`DOI: `}</strong>{doiLink}
            </div>
        );
    },

    renderSummary() {
        let { version } = this.props;
        let styles = this.styles();
        let isOpen = this.state.isOpen;
        let providerAvailability;
        if (context.hasLoggedInUser()) {
            providerAvailability = (
                <AvailabilityView
                    isSummary={ !isOpen }
                    version={ version } />
            );
        }

        return (
        <div style={ styles.content }>
            { this.renderEndDated() }
            { this.renderChangeLog() }
            <div style={ styles.availability }>
                { providerAvailability }
            </div>
        </div>
       );
    },

    renderDetail() {
        let { version } = this.props;
        let styles = this.styles();
        let isOpen = this.state.isOpen;

        let providerAvailability;
        if (context.hasLoggedInUser()) {
            providerAvailability = (
                <AvailabilityView
                    isSummary={ !isOpen }
                    version={ version }
                />
            );
        } else {
            providerAvailability = "Please login to view available providers.";
        }

        return (
        <div style={ styles.content }>
            { this.renderEndDated() }
            { this.renderChangeLog() }
            { this.renderDocObjectId() }
            <div style={ styles.availability } >
                { providerAvailability }
            </div>
        </div>
        );
    },

    renderEndDated() {
        let { version } = this.props;

        if (version.isEndDated()) {
            return (
                <Ribbon text={"End Dated"} />
            );
        }
    },

    render() {
        // todo: figure out if anything is ever recommended, or if it's just a concept idea
        let { version, image } = this.props,
            versionHash = CryptoJS.MD5(version.id.toString()).toString(),
            type = stores.ProfileStore.get().get("icon_set"),
            owner = image.get("created_by").username,
            date = this.renderDateString(version);

        let title = !version.hasDOI() ? version.get("name") : (
            <span>
                {`${ version.get("name")} `}
                <Pill>DOI</Pill>
            </span>
        );

        let subheading =  (
            <span>
                { `${date} by ${owner}` }
                { this.renderEditLink() }
            </span>
        );

        return (
            <MediaCard
                onCardClick={ this.onCardClick }
                isOpen={ this.state.isOpen }
                title={ title }
                subheading={ subheading }
                avatar={
                    <Gravatar
                        hash={versionHash}
                        size={40}
                        type={type}
                    />
                }
                summary={ this.renderSummary() }
                detail={ this.renderDetail() }
            />
        );
    },

    styles() {
        let isOpen = this.state.isOpen;
        let styles = {}

        // content
        let contentDisplay = isOpen
            ? "block" : "flex";

        styles.content = {
            display: contentDisplay,
            flexWrap: "wrap",
            justifyContent: "space-between",
        };

        // description
        let descriptionWidth = isOpen
            ? {
                width: "100%",
                maxWidth: "700px"
            } : {};

        styles.description = {
            marginRight: "40px",
            flex: "1",
            ...descriptionWidth
        };

        // availability
        let availabilityWidth = isOpen
            ? {
                width: "100%",
            }
            : {
                width: "30%",
                minWidth: "200px",
            };

        styles.availability = {
            fontSize: "12px",
            ...availabilityWidth,
        };

        // return result
        return styles;
    }
});
