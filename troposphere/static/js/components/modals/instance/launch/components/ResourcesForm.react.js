import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import ResourceGraphs from '../components/ResourceGraphs.react';
import SelectMenu from 'components/common/ui/SelectMenu.react';

export default React.createClass({

    render: function () {
        console.log(this.props.provider ,this.props.providerSizes ,this.props.providerSize)
        if (!this.props.provider || !this.props.providerSizes || !this.props.providerSize) {
            return ( <div className="loading"/>);
        }

        let name = function(item) {return item.get('name')};
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
                        optionName={name}
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
                        optionName={name}
                        onSelectChange={this.props.onSizeChange}/>
                </div>
                <div className="form-group">
                    <ResourceGraphs
                        provider={this.props.provider}
                        resourcesUsed={this.props.resourcesUsed}
                        size={this.props.providerSize}
                        sizes={this.props.providerSizes}
                        identityProvider={this.props.identityProvider}/>
                </div>
            </form>
        );
    },
});
