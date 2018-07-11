import React from "react";
import ReactDOM from "react-dom";
import RaisedButton from "material-ui/RaisedButton";
import Backbone from "backbone";
import $ from "jquery";
import stores from "stores";
import modals from "modals";
import {trackAction} from "utilities/userActivity";
import {hasExpiredPassword} from "utilities/profilePredicate";
import Bookmark from "../../common/Bookmark";

export default React.createClass({
    displayName: "HeaderView",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    componentDidMount: function() {
        // FIXME: use the Tooltip component
        var el = ReactDOM.findDOMNode(this);
        var $el = $(el).find(".tooltip-wrapper");
        $el.tooltip({
            title:
                "You can add an Image to a project to make launching instances easier!",
            placement: "left"
        });
    },

    showLaunchModal: function(e) {
        modals.InstanceModals.launch({
            image: this.props.image,
            initialView: "BASIC_VIEW"
        });
        trackAction("launched-from-image-detail", {});
    },

    showExpiredPasswordModal: function(e) {
        // launch a model that explains you need to update your password
        e.preventDefault();
        modals.ExpiredPasswordModals.show();
        trackAction("shown-expired-password-info", {});
    },

    showAddProjectModal: function(e) {
        e.preventDefault();
        modals.ProjectModals.addImage(this.props.image);
    },

    onReturnToPreviousPage: function(e) {
        e.preventDefault();
        Backbone.history.history.back();
    },

    render: function() {
        let profile = stores.ProfileStore.get(),
            {image} = this.props,
            expiredBadge,
            buttonGroup,
            launchButton;

        // NOTE: this could be `context.hasExpiredPassword()` if
        // the context module were to be used.
        // * See also: `profile.id` usage below + FIXME
        if (hasExpiredPassword(profile)) {
            let style = {
                position: "absolute",
                color: "red",
                background: "white",
                borderRadius: "50%",
                top: "-5px",
                left: "-5px"
            };
            expiredBadge = (
                <i
                    className="glyphicon glyphicon-exclamation-sign"
                    style={style}
                />
            );
            launchButton = (
                <button
                    className="btn btn-primary launch-button"
                    disabled={image.isEndDated()}
                    style={{position: "relative"}}
                    onClick={this.showExpiredPasswordModal}>
                    {expiredBadge} Launch
                </button>
            );
        } else {
            launchButton = (
                <button
                    className="btn btn-primary launch-button"
                    disabled={image.isEndDated()}
                    onClick={this.showLaunchModal}>
                    Launch
                </button>
            );
        }

        // FIXME: evaluate the use of hasLoggedInUser(profile) or
        // using `context` here, and `context.hasLoggedInUser()`
        if (profile.id) {
            buttonGroup = (
                <div>
                    <span style={{marginRight: "20px"}}>
                        <Bookmark width="25px" image={image} />
                    </span>
                    <span
                        className="tooltip-wrapper"
                        style={{marginRight: "20px"}}>
                        <RaisedButton
                            disabled={image.isEndDated()}
                            onTouchTap={this.showAddProjectModal}
                            label={
                                <span>
                                    <i className="glyphicon glyphicon-plus" />
                                    {" Add to Project"}
                                </span>
                            }
                        />
                    </span>
                    {launchButton}
                </div>
            );
        }

        return (
            <div style={this.style().header} className="image-header">
                <div style={this.style().titleGroup}>
                    <svg
                        style={this.style().backButton}
                        onClick={this.onReturnToPreviousPage}
                        fill="#000000"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z" />
                    </svg>
                    <h1 className="t-headline">{image.get("name")}</h1>
                </div>
                {buttonGroup}
            </div>
        );
    },

    style() {
        return {
            header: {
                position: "relative",
                marginBottom: "30px",
                display: "flex",
                justifyContent: "space-between"
            },

            titleGroup: {
                flex: "1"
            },

            backButton: {
                float: "left",
                cursor: "pointer",
                position: "relative",
                marginRight: "10px"
            }
        };
    }
});
