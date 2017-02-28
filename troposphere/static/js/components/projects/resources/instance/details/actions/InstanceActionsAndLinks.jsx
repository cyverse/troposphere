import $ from "jquery";

import React from "react";
import Backbone from "backbone";

import Glyphicon from "components/common/Glyphicon";

// FIXME
import InstanceActionStore from "stores/InstanceActionStore";
import InstanceActionNames from "constants/InstanceActionNames";

import featureFlags from "utilities/featureFlags";
import { findCookie } from "utilities/cookieHelpers";

import modals from "modals";


export default React.createClass({
    displayName: "InstanceActionsAndLinks",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    /**
     * A manifest, of specification listing, of element data associated
     * with a given Instance Action:
     */
    actionSpecs: function() {
        // For now, order *matters*
        let specs = [
            {
                key: InstanceActionNames.IMAGE,
                label: "Image",
                icon: "camera",
                onClick: this.onImageRequest
            },
            {
                key: InstanceActionNames.START,
                label: "Start",
                icon: "play",
                onClick: this.onStart
            },
            {
                key: InstanceActionNames.SUSPEND,
                label: "Suspend",
                icon: "pause",
                onClick: this.onSuspend
            },
            {
                key: InstanceActionNames.STOP,
                label: "Stop",
                icon: "stop",
                onClick: this.onStop
            },
            {
                key: InstanceActionNames.RESUME,
                label: "Resume",
                icon: "play",
                onClick: this.onResume
            },
            {
                key: InstanceActionNames.REBOOT,
                label: "Reboot",
                icon: "repeat",
                onClick: this.onReboot
            },
            {
                key: "Redeploy",
                label: "Redeploy",
                icon: "repeat",
                onClick: this.onRedeploy
            },
            {
                key: InstanceActionNames.DELETE,
                label: "Delete",
                icon: "remove",
                onClick: this.onDelete,
                isDangerLink: true
            }
        ];
        return specs;
    },

    getInitialState: function() {
        return { actions: null, actionElements: [] };
    },

    updateState: function() {
        let actions = InstanceActionStore.getActionsFor(this.props.instance),
            actionElements = this.state.actionElements;

        if (actions) {
            let keys = actions.pluck("key");
            actionElements = this.actionSpecs().filter((a) => keys.includes(a.key));
        }

        this.setState({actions, actionElements})
    },

    componentDidMount: function() {
        InstanceActionStore.addChangeListener(this.updateState);
        this.updateState();
    },

    componentWillUnmount: function() {
        InstanceActionStore.removeChangeListener(this.updateState);
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
        //      move this into a utilities file
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

    getIntegrationLinks() {
        let { instance } = this.props,
            webShellUrl = instance.shell_url(),
            webDesktopCapable = !!(instance && instance.get("web_desktop")),
            ipAddress = instance.get("ip_address"),
            disableWebLinks = !ipAddress || ipAddress === "0.0.0.0";

        let links = [
            {
                label: "Open Web Shell",
                icon: "console",
                href: webShellUrl,
                openInNewWindow: true,
                isDisabled: disableWebLinks
            }
        ];

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

        return links;
    },

    renderLink(link) {
        // Links without icons are generally section headings
        if (!link.icon) return (
            <li key={link.label} className="section-label">
                {link.label}
            </li>
        );

        var className = "section-link";
        if (link.isDangerLink) {
            className += " danger";
        }

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
    },

    render: function() {
        let { actions, actionElements } = this.state;

        InstanceActionStore.getActionsFor(this.props.instance);

        if (!actions) {
            return (<div className="loading" />);
        }

        let linkElements = [
                {
                    label: "Actions",
                    icon: null
                },
                {
                    label: "Report",
                    icon: "inbox",
                    onClick: this.onReport
                }
            ];

        linkElements = linkElements.concat(actionElements);
        linkElements.push({
            label: "Links",
            icon: null
        });
        linkElements = linkElements.concat(this.getIntegrationLinks());

        return (
        <div className="resource-actions">
            <ul>
                {linkElements.map(this.renderLink)}
            </ul>
        </div>

        );
    }
});
