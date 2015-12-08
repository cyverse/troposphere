import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import SelectMenu from 'components/common/ui/SelectMenu.react';

export default React.createClass({
    getInitialState: function(){
        let provider = this.props.provider;
        return {
            provider: provider
        }
    },

    onProviderChange: function(value) {
        console.log(value);
        this.setState({provider:value});
    },

    onSizeChange: function(value) {
        console.log(value);
    },

    render: function () {
        let name = function(item) {return item.get('name')};
        let defaultProviderId = this.state.provider.get('id');
        let providers = this.props.providers;
        let providerSizes = stores.SizeStore.fetchWhere({provider__id: this.state.provider.get('id')});

        return (
            <form>
                <div className="form-group">
                    <label for="instanceName">
                        Provider
                    </label>
                    <SelectMenu
                        defaultId={defaultProviderId}
                        list={providers}
                        optionName={name}
                        onSelectChange={this.onProviderChange}/>
                </div>
                <div className="form-group">
                    <label for="instanceSize">
                            Instance  Size
                    </label>
                    <SelectMenu
                        defaultId={34}
                        list={providerSizes}
                        optionName={name}
                        onSelectChange={this.onSizeChange}/>
                </div>
         </form>
        );
    },
});
