import React from "react";
import Backbone from "backbone";
import stores from "stores";

import SelectMenu from "components/common/ui/SelectMenu2.react";
import AllocationSourceGraph from "components/common/AllocationSourceGraph.react";

export default React.createClass({

    // TODO:
    // propTypes:

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

    onSourceChange: function(source) {
        this.setState({ current: source });
        this.props.onSourceChange(source);
    },

    render() {
        let allocationSourceList = stores.AllocationSourceStore.getAll();
        let current = this.state.current;
        //FIXME: onSelect to a callback that will hit actions and push the event
        return (
        <div style={{ paddingTop: "20px"}}>
            <h2 className="t-title">Allocation Source</h2>
            <div style={{ marginBottom: "20px" }}>
                <SelectMenu current={ current }
                            optionName={ item => item.get("name") }
                            list={ allocationSourceList }
                            onSelect={ this.onSourceChange } />
            </div>
            <AllocationSourceGraph allocationSource={ this.state.current } />
        </div>
        );
    }
});
