import React from "react";
import { Link } from "react-router";

import Stats from "./Stats";


export default React.createClass({
    displayName: "ProvidersList",

    render: function() {
        let providers = this.props.providers;

        let ProviderCards = providers.map(function(provider) {
            return (
            <li key={provider.get("id")}>
                <div className="media card">
                    <Link to={`providers/${provider.get("id")}`}>
                        <div className="media__content">
                            <h2 className="title-3">{provider.get("name")}</h2>
                            <p className="media__description">
                                {provider.get("description")}
                            </p>
                            <hr/>
                            <Stats provider={provider} />
                        </div>
                    </Link>
                </div>
            </li>
            );
        });
        return (
        <ul className="app-card-list">
            {ProviderCards}
        </ul>
        );
    }

});
