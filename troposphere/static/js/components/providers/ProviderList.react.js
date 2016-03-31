import React from 'react/addons';
import Backbone from 'backbone';
import Router from 'react-router';
import stores from 'stores';
import Stats from './Stats.react';

export default React.createClass({
    displayName: "ProvidersList",

    render: function () {
        let providers = this.props.providers;

        let ProviderCards = providers.map(function(provider) {
            return (
                <li key={provider.get('id')}>
                    <div className="media card" >
                        <Router.Link
                            to="provider"
                            params={{id: provider.get('id')}}>
                            <div className="media__content">
                                <h2 className="title-3">
                                    {provider.get('name')}
                                </h2>
                                <p className="media__description">
                                    {provider.get('description')}
                                </p>
                                <hr/>
                                <Stats provider={provider} />
                            </div>
                        </Router.Link>
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
