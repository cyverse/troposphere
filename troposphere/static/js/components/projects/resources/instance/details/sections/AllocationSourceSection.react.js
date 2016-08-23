import React from "react";
import Backbone from "backbone";

import SelectMenu from "components/common/ui/SelectMenu.react";
import AllocationSourceGraph from "components/common/AllocationSourceGraph.react";

export default React.createClass({

    propTypes: {
        onSourceChange: React.PropTypes.func.isRequired,
        allocationSources: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
    },

    getInitialState() {
        return this.getStateFromProps(this.props);
    },

    componentWillReceiveProps(props) {
        this.setState(this.getStateFromProps(props));
    },

    getStateFromProps(props) {
        let { allocationSources, instance } = this.props;

        // This may look strange ========v
        // This method gets called from  v
        // getInitialState, when state   v
        // doesn't exist!                v
        let { current } = this.state || {};

        if (!current) {
            current = allocationSources.findWhere({
                source_id: instance.get("allocation_source").source_id
            });
        }

        return {
            current,
        }
    },

    onSourceChange: function(source) {
        this.setState({
            current: source
        });
        this.props.onSourceChange(source);
    },

    render() {
        let { allocationSources } = this.props;
        let current = this.state.current;

        return (
        <div style={{ paddingTop: "20px" }}>
            <h2 className="t-title">Allocation Source</h2>
            <div style={{ marginBottom: "20px" }}>
                <SelectMenu current={ current }
                            optionName={ item => item.get("name") }
                            list={ allocationSources }
                            onSelect={ this.onSourceChange } />
            </div>
            <AllocationSourceGraph allocationSource={ this.state.current } />
        </div>
        );
    }
});
