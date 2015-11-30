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
            <li key={provider.id}>
                <div className="media card" >
                    <Router.Link to = "provider" params = {{id: provider.id}} >
                        <div className="media__content" >
                            <h2 className="title-3" > {provider.name} </h2>
                        <p className="media__description" > {provider.description} </p>
                        <hr/>
                        <Stats provider={provider} />
                        </div>
                    </Router.Link>
                </div>
            </li>
        );
    });
        return (
            <ul className="app-card-list" >
                {ProviderCards}
            </ul>
        );
    }

});
