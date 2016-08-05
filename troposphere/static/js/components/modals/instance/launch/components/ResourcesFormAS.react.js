import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import ResourceGraphs from '../components/ResourceGraphs.react';
import AllocationSourceGraph from 'components/common/AllocationSourceGraph.react';
import SelectMenu from 'components/common/ui/SelectMenu.react';
import SelectMenu2 from 'components/common/ui/SelectMenu2.react';

export default React.createClass({
    propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model),
        providerSizeList: React.PropTypes.instanceOf(Backbone.Collection),
        providerList: React.PropTypes.instanceOf(Backbone.Collection),
        providerSize: React.PropTypes.instanceOf(Backbone.Model),
        allocationSourceList: React.PropTypes.instanceOf(Backbone.Collection),
        allocationSource: React.PropTypes.instanceOf(Backbone.Model),
        onSizeChange: React.PropTypes.func,
        onProviderChange: React.PropTypes.func
    },

    getProviderSizeName(providerSize) {
        let name = providerSize.get('name');
        let cpu = providerSize.get('cpu');
        // TODO: determine if this rounding is necessary?
        let memory =  Math.round(providerSize.get('mem') * 100) / 100;

        return `${ name } (CPU: ${ cpu }, Mem: ${ memory } GB)`;
    },

    render: function () {
        let {
            provider, providerList, onProviderChange,
            allocationSource, allocationSourceList, onAllocationSourceChange,
            providerSize, providerSizeList, onSizeChange,
        } = this.props;

        return (
            <form>
                <div className="form-group">
                    <label htmlFor="allocationSource">
                        Allocation Source
                    </label>
                    <SelectMenu2 current={ allocationSource }
                            list={ allocationSourceList }
                            optionName={ as => as.get('name') }
                            onSelect={ onAllocationSourceChange } />
                </div>
                <div className="form-group">
                    <label htmlFor="instanceName">
                        Provider
                    </label>
                    <SelectMenu2 current={ provider }
                                optionName={ p => p.get('name') }
                                list={ providerList }
                                onSelect={ onProviderChange } />
                </div>
                <div className="form-group">
                    <label htmlFor="instanceSize">
                        Instance Size
                    </label>
                    <SelectMenu2 current={ providerSize }
                                optionName={ this.getProviderSizeName }
                                list={ providerSizeList }
                                onSelect={ onSizeChange } />
                </div>
                <div className="form-group">
                    <AllocationSourceGraph { ...this.props }/>
                    <ResourceGraphs { ...this.props }/>
                </div>
            </form>
        );
    },
});
