import React from "react";
import Backbone from "backbone";
import stores from "stores";
import context from "context";
import moment from "moment";
import CollapsibleOutput from "components/common/ui/CollapsibleOutput";

const HistoryRow = React.createClass({
    displayName: "HistoryRow",

    propTypes: {
        historyItem: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    renderFormattedExtra(extra) {
        if (!extra) {
            return "";
        } else if (extra.length > 32) {
            return <CollapsibleOutput output={extra} />;
        }
        return <p>extra</p>;
    },

    render() {
        let {historyItem} = this.props;
        let extra = historyItem.get("extra"),
            formattedStartDate = moment(historyItem.get("start_date")).format(
                "MMMM Do YYYY, h:mm a"
            );

        return (
            <tr key={historyItem.cid}>
                <td>{historyItem.get("status")}</td>
                <td>{formattedStartDate}</td>
                <td>{this.renderFormattedExtra(extra)}</td>
            </tr>
        );
    }
});

const InstanceHistorySection = React.createClass({
    displayName: "InstanceHistorySection",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function() {
        return {
            instanceHistory: stores.InstanceHistoryStore.fetchWhere({
                instance: this.props.instance.id
            }),
            refreshing: false
        };
    },

    componentDidMount: function() {
        stores.InstanceHistoryStore.addChangeListener(this.onNewData);
        stores.InstanceStore.addChangeListener(this.onNewData);
        stores.InstanceHistoryStore.addChangeListener(this.requestListener);
    },

    componentWillUnmount: function() {
        stores.InstanceHistoryStore.removeChangeListener(this.onNewData);
        stores.InstanceStore.removeChangeListener(this.onNewData);
        stores.InstanceHistoryStore.removeChangeListener(this.requestListener);
    },
    requestListener() {
        this.setState({
            refreshing: false
        });
    },

    onNewData: function() {
        this.setState({
            instanceHistory: stores.InstanceHistoryStore.fetchWhere({
                instance: this.props.instance.id
            })
        });
    },

    style() {
        return {
            refreshIcon: {
                float: "right",
                color: "lightgrey"
            }
        };
    },

    renderRefreshButton() {
        let {refreshing} = this.state;
        let {refreshIcon} = this.style();
        let controlsClass = "glyphicon glyphicon-refresh";

        if (refreshing) {
            controlsClass += " refreshing";
            refreshIcon.color = "inherit";
        }

        return (
            <span
                className={controlsClass}
                style={refreshIcon}
                onClick={this.onRefresh}
            />
        );
    },

    renderHistoryRow: function(historyItem) {
        return <HistoryRow key={historyItem.cid} historyItem={historyItem} />;
    },
    onRefresh() {
        stores.InstanceHistoryStore.clearCache();
        let instanceHistory = stores.InstanceHistoryStore.fetchWhere({
            instance: this.props.instance.id
        });
        this.setState({
            refreshing: true,
            instanceHistory
        });
    },
    render: function() {
        var content;
        let {instanceHistory} = this.state;
        if (!instanceHistory) {
            if (stores.InstanceHistoryStore.isFetching) {
                content = <div className="loading" />;
            } else {
                content = (
                    <div>
                        {
                            "Error loading instance history. Please try again later."
                        }
                    </div>
                );
            }
        } else {
            content = (
                <table
                    className="clearfix table"
                    style={{tableLayout: "fixed"}}>
                    <thead>
                        <tr>
                            <th style={{width: "150px"}}>Status</th>
                            <th>Activity</th>
                            <th>Start Date</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>{instanceHistory.map(this.renderHistoryRow)}</tbody>
                </table>
            );
        }
        return (
            <div className="resource-details-section section">
                <h4 className="t-headline">
                    Instance Status History {this.renderRefreshButton()}
                </h4>
                {content}
            </div>
        );
    }
});

export default InstanceHistorySection;
