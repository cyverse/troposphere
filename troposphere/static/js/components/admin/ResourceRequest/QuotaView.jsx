import React from "react";

import QuestionMark from "components/common/ui/QuestionMark";
import Label from "./Label";

export default React.createClass({

    propTypes: {
        quota: React.PropTypes.object.isRequired,
        onQuotaChange: React.PropTypes.func.isRequired
    },

    quotaData: {
        "cpu": {
            label: "CPU:",
            tip: "Total cpus across instances"
        },
        "memory": {
            label: "Memory (GB):",
            tip: "Total memory across instances"
        },
        "storage": {
            label: "Storage (GB):",
            tip: "Total disk space across instances"
        },
        "storage_count": {
            label: "Volumes:",
            tip: "Total number of volumes"
        },
        "snapshot_count": {
            label: "Snapshots:",
            tip: "Total number of instance snapshots"
        },
        "instance_count": {
            label: "Instances:",
            tip: "Total number of instances"
        },
        "port_count": {
            label: "Fixed IPs:",
            tip: ""
        },
        "floating_ip_count": {
            label: "Floating IPs:",
            tip: ""
        }
    },

    // field is one of [ "cpu", "memory", "storage", ...]
    handleQuotaChange(e, field) {
        let { quota } = this.props;

        let changedFieldObj = {};
        changedFieldObj[field] = Number(e.target.value);

        this.props.onQuotaChange(
             Object.assign({}, quota, changedFieldObj)
        );
    },

    style() {
        return {
            label: {
                display: "block"
            },
            quotaBlock: {
                paddingRight: "15px",
                float: "left"
            },
            questionMark: {
                float: "right"
            }
        };
    },

    renderQuotaField(data, i) {
        let { field, label, value, tip } = data;
        let { quotaBlock, questionMark, label: labelStyle } = this.style();

        let tooltip = <QuestionMark style={questionMark} tip={tip} />;

        return (
        <div style={quotaBlock} key={i}>
            <Label style={labelStyle} htmlFor={field}>
                {label}
                { tip ? tooltip : null }
            </Label>
            <input className="form-control"
                type="number"
                value={value}
                onChange={(e) => this.handleQuotaChange.call(this, e, field)} />
        </div>
        );
    },

    render() {
        let { quota } = this.props;

        // [ "cpu", "memory", "storage", ...]
        let renderedFields = Object.keys(this.quotaData)
            .filter(field => {
                if (!(field in quota)) {
                    console.warn(`This view cannot render unsupported field: ${field}`);
                    return false;
                }
                return true;
            })
            // Map field names to an object describing the data we want
            .map((field, i) => {
                return {
                    // Label for cpu quota (Ex. "CPU:")
                    label: this.quotaData[field].label,

                    // Value of user's input for cpu (Ex. 16)
                    value: quota[field],

                    // Tip for cpu quota (Ex. "Total cpus across instances")
                    tip: this.quotaData[field].tip,

                    field
                };
            })
            // Map the data to rendered elements
            .map(this.renderQuotaField);

        return (
        <div>
            { renderedFields }
        </div>
        );
    }
});
