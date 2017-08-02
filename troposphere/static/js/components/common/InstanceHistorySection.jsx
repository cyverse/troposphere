import React from "react";
import Backbone from "backbone";
import stores from "stores";
import context from "context";
import moment from "moment";


var InstanceHistorySection = React.createClass({
    displayName: "InstanceHistorySection",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function() {
        return {
            instanceHistory: stores.InstanceHistoryStore.fetchWhere({
                "instance": this.props.instance.id
            }),
            refreshing: false
        }
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
                "instance": this.props.instance.id
            })
        });
    },

    style() {
        return {
            refreshIcon: {
                float: "right",
                color: "lightgrey"
            },
        }
    },

    renderRefreshButton() {
        let { refreshing } = this.state;
        let { refreshIcon } = this.style();
        let controlsClass = "glyphicon glyphicon-refresh";

        if (refreshing) {
            controlsClass += " refreshing"
            refreshIcon.color = "inherit";
        }

        return (
        <span className={controlsClass} style={refreshIcon} onClick={this.onRefresh} />
        );
    },

    renderHistoryRow: function(historyItem) {
        let profile = stores.ProfileStore.get();
        let is_staff_user = (profile) ? profile.get("is_staff") : false;
        let extra = historyItem.get('extra'),
            formattedStartDate = moment(historyItem.get("start_date")).format("MMMM Do YYYY, h:mm a"),
            formattedEndDate = "Present";
        if (historyItem.get("end_date") && historyItem.get("end_date").isValid()) {
            formattedEndDate = moment(historyItem.get("end_date")).format("MMMM Do YYYY, h:mm a");
        }
        let formattedExtra = "";
        let formattedExtraLines = [];
        let show_traceback = (is_staff_user || context.hasEmulatedSession() );
        if(extra && 'display_error' in extra) {
            formattedExtra = extra['display_error'];
            if('traceback' in extra && show_traceback) {
                formattedExtra = formattedExtra + "\\n" + extra['traceback']
                formattedExtraLines = formattedExtra.split('\\n');
            }
        }
        return (<tr key={historyItem.cid}>
                    <td>{historyItem.get("status")}</td>
                    <td>{formattedStartDate}</td>
                    <td>{formattedEndDate}</td>
                    <td>{formattedExtraLines.map(
                        (strng, idx) => (<p key={idx}>{strng}</p>)) }
                    </td>
                </tr>);
    },
    onRefresh() {
        stores.InstanceHistoryStore.clearCache();
        let instanceHistory = stores.InstanceHistoryStore.fetchWhere({
            "instance": this.props.instance.id
        })
        this.setState({
            refreshing: true,
            instanceHistory
        });

    },
    render: function() {
        var instance = this.props.instance;
        var content;

        if (!this.state.instanceHistory) {
            if (stores.InstanceHistoryStore.isFetching) {
                content = (
                    <div className="loading" />
                );
            } else {
                content = (
                    <div>
                        {"Error loading instance history. Please try again later."}
                    </div>
                );
            }
        } else {
            content = (
                <table className="clearfix table" style={{ tableLayout: "fixed" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "100px"}}>Status</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.instanceHistory.map(this.renderHistoryRow) }
                    </tbody>
                </table>
            );
        }
        return (
        <div className="resource-details-section section">
            <h4 className="t-headline">Instance Status History {this.renderRefreshButton()}</h4>
            {content}
        </div>
        );
    }

});

export default InstanceHistorySection;
