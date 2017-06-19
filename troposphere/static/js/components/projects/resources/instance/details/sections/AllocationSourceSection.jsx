import React from "react";
import Backbone from "backbone";

import modals from "modals";
import AllocationSource from "models/AllocationSource";
import SelectMenu from "components/common/ui/SelectMenu";
import AllocationSourceGraph from "components/common/AllocationSourceGraph";
import actions from 'actions';

export default React.createClass({

    propTypes: {
        disabled: React.PropTypes.bool.isRequired,
        onSourceChange: React.PropTypes.func.isRequired,
        allocationSources: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
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

        let source = instance.get("allocation_source")
        if (!current && source) {
            let sourceModel =
                source instanceof Backbone.Model
                ? source
                : new AllocationSource(source);

            // SelectMenu must render current, which must be an element of
            // allocationSources, the above cruft is necessary, because we
            // sometimes get an instance that isn't a backbone
            current = allocationSources.find(el =>
                el.get("uuid") == sourceModel.get("uuid")
            )
        }

        return {
            current
        }
    },

    onSourceChange: function(allocationSource) {
        let { instance } = this.props;
        this.setState({
            current: allocationSource
        });
        actions.InstanceActions.updateAllocationSource({
            instance,
            allocationSource
        });
    },

    onRequestResources: function() {
        let instance = this.props.instance;
        let identity = Number(instance.get('identity').id)
        modals.HelpModals.requestMoreResources({ identity });
    },

    render() {
        let { allocationSources, disabled } = this.props;
        let current = this.state.current;

        return (
        <div style={{ paddingTop: "20px" }}>
            <h2 className="t-title">Allocation Source</h2>
            <div style={{ marginBottom: "20px" }}>
                <SelectMenu current={current}
                    disabled={disabled}
                    optionName={item => item.get("name")}
                    list={allocationSources}
                    onSelect={this.onSourceChange} />
            </div>
            <AllocationSourceGraph onRequestResources={this.onRequestResources} allocationSource={current} />
        </div>
        );
    }
});
