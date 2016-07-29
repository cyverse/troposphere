import React from 'react';
import SelectMenu from 'components/common/ui/SelectMenu.react';
import stores from 'stores';

export default React.createClass({

    // We probably won't keep state here 
    // and instead will be based on the Allocation source 
    // returned by the store given this.props.instance

    getInitialState: function() {
        return {
            current:  stores.AllocationSourceStore[1].id
        }
    },

    // This probably won't set local state
    // and instead will be passed on to an action
    onSourceChange: function(option) {
        this.setState({ current: option.id });
    },

    render: function() {
	return (
	    <div style={{ paddingTop: "20px"}}>
              <h2 className="t-title">	
	          Allocation Source
	      </h2>
              <SelectMenu
		  defaultId={ this.state.currentSource }
                  list={ stores.AllocationSourceStore }
		  optionName={ item => item.name }
                  onSelectChange={ this.onSourceChange }
              />
	    </div>
	);
    }

});

