import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import SelectMenu from 'components/common/ui/SelectMenu.react';
import ProgressBar from 'components/common/ui/ProgressBar.react';

export default React.createClass({
    getInitialState: function(){
        let provider = this.props.provider;
        return {
            provider: provider,
            size: null
        }
    },

    componentDidMount: function () {
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
    },

    onProviderChange: function(value) {
        console.log(value);
        this.setState({provider:value});
    },

    onSizeChange: function(value) {
        this.setState({size: value});
        console.log(value);
    },

    resourceProgressBarsRender: function() {
        let identityProvider = stores.IdentityStore.findOne({'provider.id': this.state.provider.id});
        if (!identityProvider) {
            return (<div className="loading-small"/>)
        } else {
        let allocation = identityProvider.attributes.usage;
        let allocationConsumed = allocation.current;
        let allocationTotal = allocation.threshold;
        let allocationRemaining = allocationTotal - allocationConsumed;
        let allocationPercent = Math.round(allocationConsumed / allocationTotal * 100);
        let auLabel =  "You have currently used " + allocationPercent + "% of " + allocationTotal + " AU's from this provider";
        let cpuLabel = "This instance will use 2 of 128 alloted CPUs";
        let gbLabel = "This instance will use 480 of 1000 alloted GBs of Memory";

        return (
                <div>
                    <ProgressBar
                        startColor="#56AA21"
                        startValue={allocationPercent + "%"}
                        label={auLabel}/>
                    <ProgressBar
                        startColor="#56AA21"
                        startValue="10%"
                        label={cpuLabel}/>
                    <ProgressBar
                        startColor="#56AA21"
                        startValue="60%"
                        label={gbLabel}/>
                </div>
                )
        }
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
                <div className="form-group">
                    {this.resourceProgressBarsRender()}
                </div>
         </form>
        );
    },
});
