define(function (require) {

    var _ = require('underscore'),
        React = require('react'),
        Backbone = require('backbone'),
        stores = require('stores'),
        ProviderCollection = require('collections/ProviderCollection');

    return React.createClass({

        propTypes: {
            application: React.PropTypes.instanceOf(Backbone.Model).isRequired
        },

        renderProvider: function (provider) {
            return (
                <li key={provider.id}>
          {provider.get('name')}
                </li>
            )
        },
        render: function () {
            var image = this.props.application;
            return this.renderProvidersFor(image);
        },

        //TODO: Consolidate this ------------------------------------------------------------------------------------------------
        renderProvidersFor: function(image) {
            var providerHash = {},
                providers = [],
                partialLoad = false,
                versions = stores.ApplicationVersionStore.fetchWhere({
                    application__id: image.id
                });
            if (!versions) {
                return <div className="loading" />
            }

            versions.map(function (version) {
                var machines = stores.ProviderMachineStore.fetchWhere({
                    version_id: version.id
                });
                if (!machines) {
                    partialLoad = true;
                    return;
                }

                var _providers = machines.filter(
                    function (machine) {
                        // filter out providers that don't exist
                        var providerId = machine.get('provider').id,
                            provider = stores.ProviderStore.get(machine.get('provider').id);

                        if (!provider) console.warn("Machine " + machine.id + " listed on version " + version.id + " showing availability on non-existent provider " + providerId);

                        return provider;
                    });

                if (_providers) {
                    providers = providers.concat(_providers);
                }
            });
            //Don't try to render until you are 100% ready
            if (partialLoad) {
                return <div className="loading" />
            }


            providers = new ProviderCollection(providers).filter(function (provider) {
                // remove duplicate providers
                if (!providerHash[provider.id]) {
                    providerHash[provider.id] = provider;
                    return true;
                }
            });
            //TODO: Consolidate this ------------------------------------------------------------------------------------------------

            return (
                <div className='image-availability image-info-segment row'>
                    <h4 className="title col-md-2">Available on</h4>
                    <div className="content col-md-10">
                        <ul className="list-unstyled">
                          {providers.map(this.renderProvider)}
                        </ul>
                    </div>
                </div>
            );
        }

    });

});
