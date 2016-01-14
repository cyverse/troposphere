import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import ResourceGraphs from '../components/ResourceGraphs.react';
import SelectMenu from 'components/common/ui/SelectMenu.react';

export default React.createClass({

    render: function () {
        if (!this.props.provider || !this.props.providerSizes || !this.props.providerSize) {
            return ( <div className="loading"/>);
        }

        let providerName = (item) => item.get('name');
        let sizeName = (item) => `${item.get('name')} (CPU: ${item.get('cpu')}, Mem: ${Math.round(item.get('mem') * 100) / 100}GB)`;
        let defaultProviderId = this.props.provider.id;
        let sizeId = this.props.providerSize.get('id');

        return (
            <form>
                <div className="form-group">
                    <label for="instanceName">
                        Provider
                    </label>
                    <SelectMenu
                        defaultId={defaultProviderId}
                        list={this.props.providers}
                        optionName={providerName}
                        onSelectChange={this.props.onProviderChange}/>
                </div>
                <div className="form-group">
                    <label for="instanceSize">
                            Instance  Size
                    </label>
                    <SelectMenu
                    //TODO Set default Size
                        defaultId={sizeId}
                        list={this.props.providerSizes}
                        optionName={sizeName}
                        onSelectChange={this.props.onSizeChange}/>
                </div>
                <div className="form-group">
                    <ResourceGraphs
                        provider={this.props.provider}
                        resourcesUsed={this.props.resourcesUsed}
                        size={this.props.providerSize}
                        sizes={this.props.providerSizes}
                        identityProvider={this.props.identityProvider}
                        onRequestResources={this.props.onRequestResources}
                        />
                </div>
            </form>
        );
    },
});
