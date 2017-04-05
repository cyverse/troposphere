import React from "react";
import Backbone from "backbone";

import SelectMenu from "./SelectMenu2";
import AllocationSourceGraph from "components/common/AllocationSourceGraph";

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
            // TODO: re-review this post-q-q-js
            let allocSrc = instance.get("allocation_source");
            if (!(allocSrc instanceof Backbone.Model)) {
                current = allocationSources.findWhere({
                    name: allocSrc.name
                });
            } else {
                // we've got a Backbone.Model
                current = allocSrc;
            }
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
        let { allocationSources, instance } = this.props;
        let current = this.state.current;
        // temp - could make this a `|| default` maybe
        if (instance.get("allocation_source")) {
            let src = instance.get("allocation_source");
            current = src instanceof Backbone.Model ? src
                : new Backbone.Model(instance.get("allocation_source"));
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
