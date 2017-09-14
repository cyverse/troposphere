import React from "react";
import CollapsibleOutput from "components/common/ui/CollapsibleOutput";

import ImageRequestActions from "actions/ImageRequestActions";

import subscribe from "utilities/subscribe";

/**
 * Create a string representing an instance's size (aka flavor)
 */
const buildInstanceSizeLabel = (size) => {
    if (!size) {
        return "(size unavailable)";
    } else {
        let { name, alias, cpu, mem, disk } = size;
        return `${name}(${alias}) : ${cpu} CPU, ${mem} MB Memory, ${disk} Disk`;
    }
};

const ImageRequest = React.createClass({
    displayName: "ImageRequest",

    propTypes: {
        params: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            response: ""
        }
    },

    handleResponseChange: function(event) {
        var response = event.target.value;
        if (response) {
            this.setState({
                response: response
            });
        }
    },

    submitUpdate: function(statusName) {
        let { ImageRequestStore, StatusStore } = this.props.subscriptions;

        var request = ImageRequestStore.get(this.props.params.id),
            status = StatusStore.findOne({
                name: statusName
            });

        ImageRequestActions.update({
            request: request,
            response: this.state.response,
            status: status.id
        });
    },

    approve: function() {
        this.submitUpdate("approved");
    },

    deny: function() {
        this.submitUpdate("denied");
    },

    resubmit: function() {
        this.submitUpdate("pending");
    },

    render: function() {
        let { ImageRequestStore } = this.props.subscriptions,
            request = ImageRequestStore.get(this.props.params.id),
            machine = request.get("parent_machine"),
            new_machine = request.get("new_machine"),
            new_provider = request.get("new_machine_provider"),
            instance = request.get("instance"),
            size = instance.size,
            instance_size_str = buildInstanceSizeLabel(size),
            instance_mach_str = instance.image.name + " v." + machine.version,
            membership_list,
            access_list,
            scripts_list,
            licenses_list;

        if (request.get("access_list")) {
            var new_access_list = JSON.parse(
                request.get("access_list").replace(/\'/g, '"'));

            access_list = new_access_list.map(function(member) {
                return member;
            }).sort().join(", ");
        } else {
            access_list = "";
        }

        if (request.get("new_version_scripts")) {
            var new_scripts_list = request.get("new_version_scripts");
            scripts_list = new_scripts_list.map(function(script) {
                //FIXME: A more advanced setup: Show the title, the type, and the contents in a constructed DIV
                return script.title;
            }).sort().join(", ");
        } else {
            scripts_list = "N/A";
        }

        if (request.get("new_version_licenses")) {
            var new_licenses_list = request.get("new_version_licenses");
            licenses_list = new_licenses_list.map(function(licenses) {
                //FIXME: A more advanced setup: Show the title, the type, and the text in a constructed DIV
                return licenses.title;
            }).sort().join(", ");
        } else {
            licenses_list = "N/A";
        }

        if (request.get("new_version_membership")) {
            var new_membership_list = request.get("new_version_membership");
            membership_list = new_membership_list.map(function(membership) {
                return membership.name;
            }).sort().join(", ");
        } else {
            membership_list = "N/A";
        }

        var allowImaging = false;
        var forked = false;

        if (request.get("new_version_forked")) {
            forked = true;
        }

        if (request.get("new_version_allow_imaging")) {
            allowImaging = true;
        }

        return (
        <div className="request-admin pull-right admin-detail">
            <div style={{ marginBottom: "20px" }}>
                <h3 className="t-body-2">Request Information</h3>
                <div>
                   { `Request ID: ${request.get("id")}` }
                </div>
                <div>
                    { `Username: ${request.get("new_machine_owner").username}` }
                </div>
                <div>
                    { `Request type: ${forked ? "New Application Request" : "Updated Application Request"}`}
                </div>
                <div>
                    { `Imaging status: ${allowImaging ? "Imaging allowed" : "Author only"}` }
                </div>
                <div>
                    { `Request state: ` }<CollapsibleOutput output={request.get("old_status")} />
                </div>
                <div>
                    { `Status: ${request.get("status").name}` }
                </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <h3 className="t-body-2">Additional Information</h3>
                <div>
                    { `Original machine: ${instance_mach_str}` }
                </div>
                <div>
                    { `Original provider: ${machine.provider.name}` }
                </div>
                <div>
                    {`Destination machine: ${new_machine ? new_machine.uuid : "N/A"}`}
                </div>
                <div>
                    { `Destination provider: ${new_provider.name}` }
                </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <h3 className="t-body-2">Application Information</h3>
                <div>
                    { `Name: ${request.get("new_application_name")}` }
                </div>
                <div>
                    { `Description: ${request.get("new_application_description")}` }
                </div>
                <div>
                    { `Tags: ${request.get("new_version_tags")}` }
                </div>
                <div>
                    { `Visbility: ${request.get("new_application_visibility")}` }
                </div>
                <div>
                    { `Membership Requested (Private Only): ${access_list}` }
                </div>
                <div>
                    { `Membership Approved (Private Only): ${membership_list}` }
                </div>
                <div>
                    { `Boot scripts (Optional): ${scripts_list}` }
                </div>
                <div>
                    { `Licenses (Optional): ${licenses_list}` }
                </div>
                <div>
                    {`Minimum Memory Threshold (Optional): ${request.get("new_version_memory_min") == 0 ? "" : request.get("new_version_memory_min")}` }
                </div>
                <div>
                    { `Minimum CPU Threshold (Optional): ${request.get("new_version_cpu_min") == 0 ? "" : request.get("new_version_cpu_min")}` }
                </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <h3 className="t-body-2">Version Information</h3>
                <div>
                    { `Name: ${request.get("new_version_name")}` }
                </div>
                <div>
                    { `Change log: ${request.get("new_version_change_log")}` }
                </div>
                <div>
                    { `Installed Software: ${request.get("installed_software")}` }
                </div>
                <div>
                    { `Excluded files: ${request.get("exclude_files")}` }
                </div>
                <div>
                    { `System files: ${request.get("system_files")}` }
                </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <h3 className="t-body-2">Instance Information</h3>
                <div>
                    { `Instance ID: ${instance.id}` }
                </div>
                <div>
                    { `Instance alias: ${instance.uuid}` }
                </div>
                <div>
                    { `Instance status: ${instance.end_date ? "Destroyed on " + instance.end_date : instance.status}` }
                </div>
                <div>
                    { `Instance size: ${instance_size_str}` }
                </div>
                <div>
                    { `Instance name: ${instance.name}` }
                </div>
            </div>
            <div>
                <h3 className="t-body-2">Response:</h3>
                <br />
                <textarea type="text"
                    form="admin"
                    value={this.state.value}
                    onChange={this.handleResponseChange} />
                <br />
                <button disabled={request.get("status").name != "pending"}
                    onClick={this.approve}
                    type="button"
                    className="btn btn-default btn-sm">
                    Approve
                </button>
                <button disabled={request.get("status").name != "pending"}
                    onClick={this.deny}
                    type="button"
                    className="btn btn-default btn-sm">
                    Deny
                </button>
                <button disabled={request.get("status").name == "closed"}
                    onClick={this.resubmit}
                    type="button"
                    className="btn btn-default btn-sm">
                    Re-Submit
                </button>
            </div>
        </div>
        );
    }
});

export default subscribe(ImageRequest, ["ImageRequestStore", "StatusStore"]);
