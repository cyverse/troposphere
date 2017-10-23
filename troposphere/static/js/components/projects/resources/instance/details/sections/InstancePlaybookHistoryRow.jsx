import React from "react";
import subscribe from "utilities/subscribe";
import Backbone from "backbone";
import PlaybookStatus from "./PlaybookStatus";


const InstancePlaybookHistoryRow = React.createClass({
    displayName: "InstancePlaybookHistoryRow",

    propTypes: {
        instancePlaybookHistory: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState() {
        return {
            refreshing: false
        }
    },

    onRedeploy() {
        this.setState({
            refreshing: true
        });
        let {InstancePlaybookStore} = this.props.subscriptions;

        let { instancePlaybookHistory } = this.props;
        let self = this;
        instancePlaybookHistory.save(
            {status:'queued'},
            {patch: true}).done(function() {
                self.setState({'refreshing':false});
            });
    },
    isInError: function(instancePlaybookStatus) {
        if(instancePlaybookStatus == 'error' || instancePlaybookStatus == 'deploy_error') {
            return true;
        }
        return false;
    },

    style() {
        return {
            td: {
                wordWrap: "break-word",
                whiteSpace: "normal",
                border: 'none',
            },
            refresh: {
                float: 'right',
                color: 'lightgray'
            }
        }
    },
    render: function() {
        let { td, refresh } = this.style();
        let { instancePlaybookHistory } = this.props;
        let { refreshing } = this.state;

        let controlsClass = "glyphicon glyphicon-refresh";
        if (refreshing) {
            controlsClass += " refreshing"
        }
        let playbook_args = instancePlaybookHistory.get("playbook_arguments");
        let status = instancePlaybookHistory.get("status");
        let nameCell;
        if(this.isInError(status)) {
            let refreshSpan = (<span className={controlsClass} style={refresh} onClick={this.onRedeploy} />);
            nameCell = (
                <td style={td}>
                    {instancePlaybookHistory.get("playbook_name")}
                    {refreshSpan}
                </td>
            );
        } else {
            nameCell = (
                <td style={td}>
                    {instancePlaybookHistory.get("playbook_name")}
                </td>
            );
        }
        return (
        <tr className="card" key={instancePlaybookHistory.id}>
            {nameCell}
            <td style={td}>
                {playbook_args.ATMOUSERNAME}
            </td>
            <td style={td}>
                <PlaybookStatus instancePlaybookHistory={instancePlaybookHistory} />
            </td>
            <td style={td}>
                {instancePlaybookHistory.get("message")}
            </td>
        </tr>
        );
    }
});

export default subscribe(InstancePlaybookHistoryRow, ["InstancePlaybookStore"]);
