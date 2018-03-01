import React from "react";
import Backbone from "backbone";

import CopyButton from "components/common/ui/CopyButton";

import subscribe from "utilities/subscribe";

import context from "context";


const WrapWithHyperlink = ({href, children}) => (
  href ? <a href={href}>{children}</a> : <span>{children}</span>
);


const FormattedIpAddress = React.createClass({
    displayName: "FormattedIpAddress",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        includeCopyButton: React.PropTypes.bool
    },

    getInitialState() {
        let {UserPreferenceStore} = this.props.subscriptions;
        let userPreference = UserPreferenceStore.get();

        return {
            includeCopyButton: false,
            userPreference
        };
    },

    updateState() {
        this.setState(this.getInitialState());
    },

    render() {
        let { instance,
              userPreference,
              includeCopyButton } = this.props,
            address = instance.getIpAddress(),
            hyperlink,
            allowLinks;

        if (!userPreference) {
            return (
                <span className="loading-tiny-inline" />
            );
        } else {
            allowLinks = userPreference.getAllowSshHyperlink();
        }

        if (!instance.hasIpAddress()) {
            address = "N/A";
        } else {
            let username = context.getUsername(),
                prefix = (username && !context.hasEmulatedSession())
                       ? `${username}@` : '';
            // if you're emulating, then don't apply the ":username@" prefix
            hyperlink = `ssh://${prefix}${address}`;
        }

        return (
        <div>
            <WrapWithHyperlink href={hyperlink}
                               allowLinks={allowLinks}>
                {address}
            </WrapWithHyperlink>
            {instance.hasIpAddress() && includeCopyButton
             ? <CopyButton text={ address }/> : null}
        </div>
        );
    }
});

export default subscribe(FormattedIpAddress, ["UserPreferenceStore"])
