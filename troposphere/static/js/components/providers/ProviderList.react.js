import React from 'react/addons';
import Backbone from 'backbone';
import Router from 'react-router';
import stores from 'stores';
import Stats from './Stats.react';

export default React.createClass({
    displayName: "ProvidersList",

    render: function () {
    var providers = this.props.providers;

    var ProviderCards =  providers.map(function(item) {
        var provider = item.attributes;
        return (
            <li>
                <div className = "app-card">
                    <Router.Link to= "provider" params={{id: provider.id}} >
                        <span className = "app-name">
                            <h2 className = "title-3" >{provider.name}</h2>
                        </span>
                        <p>{provider.description}</p>
                        <Stats provider={provider}/>
                    </Router.Link>
                </div>
            </li>
        )
    });
        return (
            <ul className = "app-card-list">
                {ProviderCards}
            </ul>
        )
    }

});
