import React from "react";
import Backbone from "backbone";

import ResourceDetail from "components/projects/common/ResourceDetail";
import CopyButton from "components/common/ui/CopyButton";

import context from "context";

const WrapWithHyperlink = ({href, children}) => (
  href ? <a href={href}>{children}</a> : <span>{children}</span>
);


export default React.createClass({
    displayName: "IpAddress",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render() {
        var instance = this.props.instance,
            address = instance.getIpAddress(),
            hyperlink;

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
        <ResourceDetail label="IP Address">
            <WrapWithHyperlink href={hyperlink}>{address}</WrapWithHyperlink>
            {instance.hasIpAddress() ? <CopyButton text={ address }/> : null}
        </ResourceDetail>
        );
    }
});
