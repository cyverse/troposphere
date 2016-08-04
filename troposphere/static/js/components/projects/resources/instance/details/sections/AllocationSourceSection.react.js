import React from "react";
import Backbone from "backbone";
import stores from "stores";

import SelectMenu from "components/common/ui/SelectMenu2.react";
import AllocationSourceGraph from "components/common/AllocationSourceGraph.react";

export default React.createClass({

    getInitialState() {
        return {
            current: null
        }
    },

    componentDidMount() {
        stores.AllocationSourceStore.addChangeListener(this.updateState)
        this.updateState();
    },

    componentWillUnmount() {
        stores.AllocationSourceStore.removeChangeListener();
    },

    updateState() {
        let allocationSourceList = stores.AllocationSourceStore.getAll();
        if (!this.state.current && allocationSourceList) {
            let current = allocationSourceList.first();
            this.setState({
                current,
            });
        }
    },

    render() {
        let allocationSourceList = stores.AllocationSourceStore.getAll();
        let current = this.state.current;

        return (
        <div style={{ paddingTop: "20px"}}>
            <h2 className="t-title">Allocation Source</h2>
            <div style={{ marginBottom: "20px" }}>
                <SelectMenu current={ current }
                            optionName={ item => item.get("name") }
                            list={ allocationSourceList }
                            onSelect={ elem => this.setState({ current: elem }) } />
            </div>
            <AllocationSourceGraph allocationSource={ this.state.current } />
        </div>
        );
    }
});
