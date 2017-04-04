import React from "react";
import Backbone from "backbone";
import Glyphicon from "components/common/Glyphicon";
import modals from "modals";
import context from "context";

import featureFlags from "utilities/featureFlags";
import { findCookie } from "utilities/cookieHelpers";

import $ from "jquery";


export default React.createClass({
    displayName: "InstanceActionsAndLinks",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onStart: function() {
        modals.InstanceModals.start(this.props.instance);
    },

    onSuspend: function() {
        modals.InstanceModals.suspend(this.props.instance);
    },

    onStop: function() {
        modals.InstanceModals.stop(this.props.instance);
    },

    onResume: function() {
        modals.InstanceModals.resume(this.props.instance);
    },

    onReport: function() {
        modals.InstanceModals.report({
            instance: this.props.instance
        });
    },

    onImageRequest: function() {
        modals.InstanceModals.requestImage({
            instance: this.props.instance
        });
    },

    onDelete: function() {
        var instance = this.props.instance,
            project;

        if (this.props.project) {
            project = this.props.project;
        }

        modals.InstanceModals.destroy({
            instance: instance,
            project: project,
            linksTo: "project-resources"
        });
    },

    onRedeploy: function() {
        modals.InstanceModals.redeploy(this.props.instance);
    },

    onReboot: function() {
        modals.InstanceModals.reboot(this.props.instance);
    },

    onWebDesktop: function(ipAddr, instance) {
        // TODO:
        //      move this into a utilties file
        var CSRFToken = findCookie("tropo_csrftoken");

        // build a form to POST to web_desktop
        var form = $("<form>")
            .attr("method", "POST")
            .attr("action", "/web_desktop")
            .attr("target", "_blank");

        form.append($("<input>")
            .attr("type", "hidden")
            .attr("name", "ipAddress")
            .attr("value", ipAddr));

        form.append($("<input>")
            .attr("type", "hidden")
            .attr("name", "csrfmiddlewaretoken")
            .attr("style", "display: none;")
            .attr("value", CSRFToken));

        $("body").append(form);
        form[0].submit();
    },

    getLinksArray: function() {
        var webShellUrl = this.props.instance.shell_url(),
            webDesktopCapable = !!(this.props.instance && this.props.instance.get("web_desktop")),
            status = this.props.instance.get("state").get("status"),
            activity = this.props.instance.get("state").get("activity"),
            ip_address = this.props.instance.get("ip_address"),
            webLinksDisabled = !ip_address || ip_address === "0.0.0.0",
            inFinalState = this.props.instance.get("state").isInFinalState();
        // todo: Add back and implement reboot and resize once it's understood how to
        // I'm hiding from the display for now so as not to show users functionality
        // that doesn't exist.
        var linksArray = [
            {
                label: "Actions",
                icon: null
            },
            {
                label: "Report",
                icon: "inbox",
                onClick: this.onReport
            }
        //{label: 'Reboot', icon: 'repeat', onClick: this.onReboot},
        //{label: 'Resize', icon: 'resize-full', onClick: this.onResize},
        ];
        let instance_owner = this.props.instance.get('user'),
            project_leaders = this.props.project.get('leaders'),
            current_user = context.profile.get('username');

        let is_leader = project_leaders.find(function(project) { return project.username == current_user });
        let is_leader_or_owner = (current_user == instance_owner.username || is_leader != null);

        if (!is_leader_or_owner) {
            linksArray = [
            {
                label: "Actions",
                icon: null
            },
            {
                label: "Shared Instance - No Actions Available",
                icon: null
            }];
            return linksArray;
        }
        if (status !== "suspended") {
            linksArray.push({
                label: "Image",
                icon: "camera",
                onClick: this.onImageRequest
            });
        }

        // Add in the conditional links based on current machine state
        if (inFinalState) {
            if (status === "active") {
                linksArray.push({
                    label: "Suspend",
                    icon: "pause",
                    onClick: this.onSuspend
                });
                linksArray.push({
                    label: "Stop",
                    icon: "stop",
                    onClick: this.onStop
                });
                linksArray.push({
                    label: "Reboot",
                    icon: "off",
                    onClick: this.onReboot
                });
                linksArray.push({
                    label: "Redeploy",
                    icon: "repeat",
                    onClick: this.onRedeploy
                });
            } else if (status === "suspended") {
                linksArray.push({
                    label: "Resume",
                    icon: "play",
                    onClick: this.onResume
                });
                linksArray.push({
                    label: "Reboot",
                    icon: "off",
                    onClick: this.onReboot
                });
            } else if (status === "shutoff") {
                linksArray.push({
                    label: "Start",
                    icon: "play",
                    onClick: this.onStart
                });
            }
        }

        if (activity === "deploying" || status === "deploying"
            || activity === "user_deploy_error" || status === "user_deploy_error"
            || activity === "deploy_error" || status === "deploy_error"
            || activity === "initializing" || activity === "boot_script_error") {
            linksArray.push({
                label: "Redeploy",
                icon: "repeat",
                onClick: this.onRedeploy
            });
        }

        if (!inFinalState && status === "active" && (activity === "networking"
            || activity === "running_boot_script")) {
            linksArray.push({
                label: "Reboot",
                icon: "off",
                onClick: this.onReboot
            });
            linksArray.push({
                label: "Redeploy",
                icon: "repeat",
                onClick: this.onRedeploy
            });
        }
        linksArray = linksArray.concat([
            {
                label: "Delete",
                icon: "remove",
                onClick: this.onDelete,
                isDangerLink: true
            },
            {
                label: "Links",
                icon: null
            },
            {
                label: "Open Web Shell",
                icon: "console",
                href: webShellUrl,
                openInNewWindow: true,
                isDisabled: webLinksDisabled
            }
        ]);

        if (webDesktopCapable && featureFlags.WEB_DESKTOP) {
            linksArray.push({
                label: "Open Web Desktop",
                icon: "sound-stereo",
                onClick: this.onWebDesktop.bind(
                    this,
                    ip_address,
                    this.props.instance),
                openInNewWindow: true,
                isDisabled: webLinksDisabled
            });
        }

        return linksArray;
    },

    render: function() {
        var linksArray = this.getLinksArray();
        var links = linksArray.map(function(link) {
            // Links without icons are generally section headings
            if (!link.icon) return (
                <li key={link.label} className="section-label">
                    {link.label}
                </li>
                );

            var className = "section-link";
            if (link.isDangerLink)
                className += " danger";

            let linkLabelMarkup = (
                <span>
                    <Glyphicon name={link.icon}/>{` ${link.label}`}
                </span>
            );

            // todo: This isn't implemented well at all.  We should be disabling these
            // buttons if there isn't a valid href for the link, or (perhaps) not even
            // showing the buttons at all...but I think it's better communication to
            // disable the buttons with a message explaining why on rollover.
            //
            if (link.openInNewWindow) {
                let linkProps,
                    style = {};
                if (!link.href && !link.onClick)
                    style.cursor = "not-allowed";

                linkProps = {
                    key: link.label,
                    className: className + " link",
                    disabled: link.isDisabled
                }
                // conditionally include a click handler
                if (link.onClick) {
                    linkProps.onClick = link.onClick
                }

                return (
                <li {...linkProps}>
                    <a href={link.href} target="_blank">
                        {linkLabelMarkup}
                    </a>
                </li>
                );
            }

            // Some actions have hrefs, because they redirect to actual pages (and are
            // not actions in need of confirmation).  While we *could* call
            // Backbone.history.navigate from an onClick callback, we want all url
            // changes to pass through our Backbone catcher in main.js that we can use
            // to log requests to Google Analytics
            if (link.href) {
                return (
                <li key={link.label} className={className + " link"}>
                    <a href={link.href}>
                        {linkLabelMarkup}
                    </a>
                </li>
                );
            }

            // Links with onClick callbacks will typically trigger modals requiring
            // confirmation before continuing
            return (
            <li key={link.label} className={className} onClick={link.onClick}>
                {linkLabelMarkup}
            </li>
            );
        });

        return (
        <div className="resource-actions">
            <ul>
                {links}
            </ul>
        </div>

        );
    }
});
