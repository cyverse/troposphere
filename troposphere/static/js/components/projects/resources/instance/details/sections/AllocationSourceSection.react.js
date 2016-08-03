import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';

import SelectMenu from 'components/common/ui/SelectMenu.react';
import AllocationSourceGraph from 'components/common/AllocationSourceGraph.react';

export default React.createClass({

    // We probably won't keep state here 
    // and instead will be based on the Allocation source 
    // returned by the store given this.props.instance

    getInitialState: function() {
        return {
            current: null
        }
    },

    componentDidMount: function() {
        stores.AllocationSourceStore.addChangeListener(this.updateState)
        this.updateState();
    },

    componentWillUnmount: function() {
        stores.AllocationSourceStore.removeChangeListener();
    },

    updateState: function() {

        if (!this.state.current) {
            let allocationSourceList = stores.AllocationSourceStore.getAll();
            let current = allocationSourceList.first();
            console.log("allocationSourceList", allocationSourceList);
            console.log("current", current);

            this.setState({
                current,
            });
        }

    },
    // This probably won't set local state
    // and instead will be passed on to an action
    onSourceChange: function(id) {
        let allocationSourceList = stores.AllocationSourceStore.getAll();

        let current = allocationSourceList.find(
            item => item.get('id') === id
        );

        this.setState({ current });
    },

    render: function() {

        let allocationSourceList = stores.AllocationSourceStore.getAll();

        let id;
        if (this.state.current) {
            id = this.state.current.get('id');
        }
             
        return (
            <div style={{ paddingTop: "20px"}}>
                <h2 className="t-title">	
                    Allocation Source
                </h2>

                <div style={{ marginBottom: "20px" }}>
                    <SelectMenu
                    defaultId={ id }
                      list={ allocationSourceList }
                    optionName={ /* Callback */ item => item.get('name') }
                      onSelectChange={ this.onSourceChange }
                    />
                </div>
                <AllocationSourceGraph 
                    allocationSource={ this.state.current }
                />
            </div>
        );
    }
});
