import React from "react";
import subscribe from "utilities/subscribe";
import InstancePlaybookHistoryRow from "./InstancePlaybookHistoryRow";
import featureFlags from "utilities/featureFlags";
//FIXME: POLLing for InstancePlaybookStore is required to complete this feature.

const InstancePlaybookHistorySection = React.createClass({
    displayName: "InstancePlaybookHistorySection",

    propTypes: {
       instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
    },

    getInitialState() {
        return {
            refreshing: false
        }
    },

    renderHeaderRow: function() {
        return (
            <tr>
                <th style={{ width: "200px"}}>Command</th>
                <th>Arguments</th>
                <th style={{ width: "70px"}}>Status</th>
                <th>Message</th>
            </tr>
        );
    },
    renderInstancePlaybookHistoryRow: function(instancePlaybookHistory) {
        return (
            <InstancePlaybookHistoryRow
                instancePlaybookHistory={instancePlaybookHistory}
                key={instancePlaybookHistory.id}
            />);
    },


    renderRows: function() {
        let {InstancePlaybookStore } = this.props.subscriptions;
        let instance_playbook_histories = InstancePlaybookStore.getForInstance(this.props.instance);
        if(instance_playbook_histories == null) {
            return (<div className="loading"/>);
        } else if (instance_playbook_histories.length == 0) {
            return (
                <tr>
                    {"No commands found."}
                </tr>
            );
        } else {
            return instance_playbook_histories.map(this.renderInstancePlaybookHistoryRow);
        }
    },
    renderRefreshIcon() {
        let { refreshing } = this.state;
        let controlsClass = "glyphicon glyphicon-refresh";
        let style = {float: 'right', color: 'lightgray'};
        if (refreshing) {
            controlsClass += " refreshing"
            style.color = "inherit";
        }

        return (
        <span className={controlsClass} style={style} onClick={this.onRefresh} />
        );
    },
    //For refresh icon
    componentDidMount() {
        let {InstancePlaybookStore} = this.props.subscriptions;
        InstancePlaybookStore.addChangeListener(this.requestListener);
    },
    componentWillUnmount() {
        let {InstancePlaybookStore} = this.props.subscriptions;
        InstancePlaybookStore.addChangeListener(this.requestListener);
    },

    requestListener() {
        this.setState({
            refreshing: false
        });
    },

    onRefresh() {
        this.setState({
            refreshing: true
        });
        let {InstancePlaybookStore} = this.props.subscriptions;

        InstancePlaybookStore.clearCache();
        InstancePlaybookStore.getAll();
    },
    //End-For refresh icon

    render: function() {
        if(!featureFlags.hasInstanceSharing()) {
            return;
        }
        return (
        <div>
            <div className="resource-details-section section">
                <h4 className="t-title">Instance Command History</h4>
                <div style={{maxWidth: "600px"}}>
                    <p>
                        Use the table below to track the commands that
                        have been executed in your instance.
                    </p>
                </div>
            </div>
            <div id="container" className="instance-playbook-history">
                {this.renderRefreshIcon()}
                <table className="clearfix table" style={{ tableLayout: "fixed" }}>
                    <thead>
                        {this.renderHeaderRow()}
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        </div>
        );
    }
});
export default subscribe(InstancePlaybookHistorySection, ["InstancePlaybookStore"]);
