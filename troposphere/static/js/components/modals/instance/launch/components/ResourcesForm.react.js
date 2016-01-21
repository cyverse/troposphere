import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import ResourceGraphs from '../components/ResourceGraphs.react';
import SelectMenu from 'components/common/ui/SelectMenu.react';

export default React.createClass({

    render: function () {
        if (!this.props.provider || !this.props.providerSizeList || !this.props.providerSize) {
            return ( <div className="loading"/>);
        }

        let providerName = (item) => item.get('name');
        let sizeName = (item) => `${item.get('name')} (CPU: ${item.get('cpu')}, Mem: ${Math.round(item.get('mem') * 100) / 100}GB)`;
        let defaultProviderId = this.props.provider.id;
        let sizeId = this.props.providerSize.get('id');

        return (
            <form>
                <div className="form-group">
                    <label htmlFor="provider">
                        Provider
                    </label>
                    <SelectMenu
                        id="provider"
                        defaultId={defaultProviderId}
                        list={this.props.providerList}
                        optionName={providerName}
                        onSelectChange={this.props.onProviderChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="instanceSize">
                            Instance  Size
                    </label>
                    <SelectMenu
                        id="instanceSize"
                        defaultId={sizeId}
                        list={this.props.providerSizeList}
                        optionName={sizeName}
                        onSelectChange={this.props.onSizeChange}
                    />
                </div>
                <div className="form-group">
                    <ResourceGraphs
                        provider={this.props.provider}
                        resourcesUsed={this.props.resourcesUsed}
                        size={this.props.providerSize}
                        sizes={this.props.providerSizeList}
                        identityProvider={this.props.identityProvider}
                        onRequestResources={this.props.onRequestResources}
                    />
                </div>
            </form>
        );
    },
});
