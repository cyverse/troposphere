import React from 'react';
import SelectMenu from 'components/common/ui/SelectMenu.react';
import AllocationSourceGraph from 'components/common/AllocationSourceGraph.react';
import stores from 'stores';

export default React.createClass({

    // We probably won't keep state here 
    // and instead will be based on the Allocation source 
    // returned by the store given this.props.instance

    getInitialState: function() {
        return {
            current:  stores.AllocationSourceStore[1]
        }
    },

    // This probably won't set local state
    // and instead will be passed on to an action
    onSourceChange: function(id) {
	let current = stores.AllocationSourceStore.find(
	    item => item.id === id
	);

        this.setState({ current });
    },

    render: function() {
	return (
	    <div style={{ paddingTop: "20px"}}>
              <h2 className="t-title">	
	          Allocation Source
	      </h2>

              <div style={{ marginBottom: "20px" }}>
              <SelectMenu
		  defaultId={ this.state.current.id }
                  list={ stores.AllocationSourceStore }
		  optionName={ /* Callback */ item => item.name }
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

