import React from "react";
import Backbone from "backbone";

import CopyButton from "components/common/ui/CopyButton";


export default React.createClass({
    displayName: "OptionInfoMenu",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function() {
        let { instance } = this.props,
            alias = instance.get("uuid"),
            address = instance.get("ip_address"),
            ipCopyElement = null;

        if (!instance.hasIpAddress()) {
            address = "N/A";
        } else {
            ipCopyElement = (
                <span className="pull-right">
                    <CopyButton text={address} />
                </span>
            );
        }

        return (
            <div className="dropdown text-center">
                <a className="dropdown-toggle" href="#" data-toggle="dropdown">
                    <i className={'glyphicon glyphicon-option-vertical'} />
                </a>
                <ul className="dropdown-menu dropdown-menu-right"
                    style={{minWidth: "365px"}}>
                    <li style={{padding: "0px 10px 0px 10px"}}>
                        <strong>IP:</strong> {address}{" "}
                        {ipCopyElement}
                    </li>
                    <li style={{padding: "0px 10px 0px 10px"}}>
                        <strong>Alias:</strong> {alias}{" "}
                        <span className="pull-right">
                            <CopyButton text={alias} />
                        </span>
                    </li>
                </ul>
            </div>
        );
    }
});
