import React from "react";
import Backbone from "backbone";

import globals from "globals";
import ResourceGraphs from "../components/ResourceGraphs";
import ProviderAllocationGraph from "../components/ProviderAllocationGraph";
import AllocationSourceGraph from "components/common/AllocationSourceGraph";
import SelectMenu from "components/common/ui/SelectMenu";

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
        let name = providerSize.get("name");
        let cpu = providerSize.get("cpu");
        let disk = providerSize.get("disk");
        let disabled = providerSize.get("disabled");
        let diskStr = ""
        if (disk == 0) {
            disk = providerSize.get("root");
        }
        if (disk != 0) {
            diskStr = `Disk: ${ disk } GB`
        }
        let memory = providerSize.get("mem");
        let disabledStr = (!disabled) ? "" : " (Disabled - select a larger size)";

        return `${ name } (CPU: ${ cpu }, Mem: ${ memory } GB, ${ diskStr })${disabledStr }`;
    },

    renderAllocationSourceMenu() {
        let { allocationSource,
              allocationSourceList,
              onAllocationSourceChange } = this.props;

        return (
        <div className="form-group">
            <label htmlFor="allocationSource">
                Allocation Source
            </label>
            <SelectMenu current={allocationSource}
                list={allocationSourceList}
                optionName={as => as.get("name")}
                onSelect={onAllocationSourceChange} />
        </div>
        );
    },

    renderAllocationSourceGraph() {
        return (
        <AllocationSourceGraph { ...this.props } />
        );
    },

    renderProviderGraph() {
        return (
        <ProviderAllocationGraph { ...this.props } />
        );
    },
    renderProviderSizeOption(providerSize, index) {
        let props = {
            label: this.getProviderSizeName(providerSize),
            key: index,
            value: index,
            disabled: providerSize.get('disabled')
        }
        return (
                <option {...props}>
                    {props.label}
                </option>
        );
    },

    render: function() {
        let { provider,
              providerList,
              onProviderChange,
              providerSize,
              providerSizeList,
              onSizeChange } = this.props;

        return (
        <form>
            {globals.USE_ALLOCATION_SOURCES
             ? this.renderAllocationSourceMenu()
             : null}
            <div className="form-group">
                <label htmlFor="provider">
                    Provider
                </label>
                <SelectMenu id="provider"
                            current={ provider }
                            optionName={ p => p.get("name") }
                            list={ providerList }
                            onSelect={ onProviderChange } />
            </div>
            <div className="form-group">
                <label htmlFor="instanceSize">
                    Instance Size
                </label>
                <SelectMenu current={providerSize}
                    renderListOption={this.renderProviderSizeOption}
                    list={providerSizeList}
                    onSelect={onSizeChange} />
            </div>
            <div className="form-group">
                {globals.USE_ALLOCATION_SOURCES
                 ? this.renderAllocationSourceGraph()
                 : this.renderProviderGraph()}
                <ResourceGraphs { ...this.props } />
            </div>
        </form>
        );
    },
});
