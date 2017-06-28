import React from "react";
import _ from "underscore";
import Backbone from "backbone";

import stores from "stores";
import { browserHistory } from "react-router";
import ResourceRequestView from "./ResourceRequestView";
import ResourceActions from "actions/ResourceActions";
import Quota from "models/Quota";

// This component is responsible for interfacing with our stores, and
// fetching/aggregating data. It does the dirty work for the
// ResourceRequestView.
export default React.createClass({

    propTypes: {
        selectedRequest: React.PropTypes.object,
        requests: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getInitialState() {
        return {
            actionPending: false
        };
    },

    componentDidMount() {
        stores.StatusStore.addChangeListener(this.updateState);
        stores.AllocationSourceStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.QuotaStore.addChangeListener(this.updateState);
    },

    componentWillUnmount() {
        stores.StatusStore.removeChangeListener(this.updateState);
        stores.AllocationSourceStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.QuotaStore.removeChangeListener(this.updateState);
    },

    updateState() {
        // If new models come along trigger a re-render
        this.forceUpdate();
    },
    findQuotaForValues(current_quota) {
        /**
         * current_quota: Javascript _Object_ that has quotaValues currently assigned
         */
        let all_quotas = stores.QuotaStore.getAll();
        if (!all_quotas) {
            return ;
        }
        var all_fields = this.getQuotaFields();
        let quota_matched = all_quotas.find(function(quota) {
            let matching_all_values = _.every(all_fields, (field, i) => {
                let value = current_quota[field]
                let quota_value = quota.get(field)
                return (quota_value == value)
            });
            return matching_all_values;
        });
        return quota_matched;
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
        },
    },
    getQuotaFields() {
        // Returns:
        // [
        //     "cpu",
        //     "instance_count",
        //     "floating_ip_count"
        //     ...
        //  ]
        return Object.keys(this.quotaData);
    },

    onApprove(view) {
        let { selectedRequest: request } = this.props;
        let {
            quota: storeQuota,
            allocationSources: storeAllocations,
            identity,
            statuses
        } = this.fetch();

        let { quota, allocationSources } = view;

        let response = view.response;
        let quotaChanged =
            // Test if some of the attributes are not equal
            storeQuota.keys().some(attr => storeQuota.get(attr) !== quota[attr]);

        let updatedQuota = null;
        if (quotaChanged) {
            let quota_matched = this.findQuotaForValues(quota);
            if(quota_matched) {
                updatedQuota = quota_matched;
            } else {
                updatedQuota = new Quota(_.omit(quota, "id"));
            }
        }

        let changedAllocations = allocationSources
            .filter(as => {
                let storeAs = storeAllocations.get(as.uuid);
                let allocationChanged =
                    storeAs.keys().some(attr => storeAs.get(attr) !== as[attr])
                return allocationChanged;
            })
            .map(as => {
                let storeAs = storeAllocations.get(as.uuid);
                return storeAs.set(as);
            })

        let status = statuses.findWhere({
            name: "approved"
        });

        this.setState({ actionPending: true });
        ResourceActions.approve({
            allocationSources: changedAllocations,
            identity,
            quota: updatedQuota,
            status,
            request,
            response
        }).then(() => {
            browserHistory.push("/application/admin/resource-requests");
        }).catch(this.setActionResolved)
    },

    setActionResolved() {
        this.setState({ actionPending: false });
    },

    onDeny(view) {
        let { selectedRequest: request } = this.props;
        let { statuses } = this.fetch();

        let response = view.response;

        let status = statuses.findWhere({
            name: "denied"
        });

        this.setState({ actionPending: true });
        ResourceActions.deny({
            request,
            response,
            status
        }).then(() => {
            browserHistory.push("/application/admin/resource-requests");
        }).catch(this.setActionResolved)
    },

    fetch() {
        let { selectedRequest: request } = this.props;
        let quotas = stores.QuotaStore.getAll();
        let statuses = stores.StatusStore.getAll();

        let identities;
        if (request)
            identities = stores.IdentityStore.fetchWhere({
                username: request.get("created_by").username
            });

        let identity;
        if (identities && request)
            identity = identities.get(request.get("identity").uuid);

        let quota;
        if (quotas && identity)
            quota = quotas.get(identity.get("quota").id);

        let allocationSources;
        if (request)
            allocationSources = stores.AllocationSourceStore.fetchWhere({
                "username": request.get("created_by").username
            });

        return {
            allocationSources,
            identity,
            quota,
            statuses
        };
    },

    render() {
        let { allocationSources, quota } = this.fetch();
        let { selectedRequest } = this.props;
        let { actionPending } = this.state;

        // Wait for the data necessary for the view
        if (actionPending || !(allocationSources && quota)) {
            return (
                <div className="loading"></div>
            );
        }

        let viewProps = {
            request: selectedRequest.toJSON(),
            allocationSources: allocationSources.map(as => as.toJSON()),
            quota: quota.toJSON(),
            onApprove: this.onApprove,
            onDeny: this.onDeny
        };

        return (
        <ResourceRequestView {...viewProps} />
        );
    }
});
