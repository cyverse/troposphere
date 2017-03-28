import React from "react";
import Backbone from "backbone";

import SelectMenu from "./SelectMenu2";
import AllocationSourceGraph from "components/common/AllocationSourceGraph";
import actions from 'actions';

export default React.createClass({

    propTypes: {
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

        if (instance.get("allocation_source")) {
            let allocSrc = instance.get("allocation_source");
            if (!(allocSrc instanceof Backbone.Model)) {
                current = allocationSources.findWhere({
                    uuid: allocSrc.uuid
                });
            } else {
                // we've got a Backbone.Model
                current = allocSrc;
            }
        } else {
            // User has old instances w/o allocation_sources, they should be
            // seeing a dialogue to prompt for choosing an allocationSource
        }

        return {
            current,
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

    render() {
        let { allocationSources, instance } = this.props;
        let { current } = this.state;

        if (instance.get("allocation_source")) {
            let src = instance.get("allocation_source");
            current = src instanceof Backbone.Model ? src
                : new Backbone.Model(instance.get("allocation_source"));
        } else {
            return (<div className="loading"></div>);
        }

        return (
        <div style={{ paddingTop: "20px" }}>
            <h2 className="t-title">Allocation Source</h2>
            <div style={{ marginBottom: "20px" }}>
                <SelectMenu current={current}
                    optionName={item => item.get("name")}
                    findIndex={(el, idx, arr) => el.get("uuid") == current.get("uuid")}
                    list={allocationSources}
                    onSelect={this.onSourceChange} />
            </div>
            <AllocationSourceGraph allocationSource={current} />
        </div>
        );
    }
});
