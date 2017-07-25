import React from "react";
import Backbone from "backbone";

import modals from "modals";
import SelectMenu from "components/common/ui/SelectMenu";
import AllocationSourceGraph from "components/common/AllocationSourceGraph";
import actions from 'actions';

export default React.createClass({

    propTypes: {
        disabled: React.PropTypes.bool.isRequired,
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
        let { instance } = props;

        let source = instance.get("allocation_source");
        let allocationId =
            source instanceof Backbone.Model
            ? source.get("uuid")
            : source.uuid

        return {
            allocationId,
        }
    },

    onSourceChange: function(allocationSource) {
        let { instance } = this.props;
        this.setState({
            allocationId: allocationSource.get("uuid")
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
        let { allocationId } = this.state;

        let current = allocationSources.find(
            el => el.get("uuid") == allocationId
        )

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
