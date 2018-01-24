import React from "react";
import _ from "underscore";
import Backbone from "backbone";

import Utils from "actions/Utils";
import stores from "stores";
import { browserHistory } from "react-router";
import ResourceRequestView from "./ResourceRequestView";
import AdminResourceRequestActions from "actions/AdminResourceRequestActions";
import Quota from "models/Quota";
import AllocationSourceConstants from "constants/AllocationSourceConstants";
import IdentityConstants from "constants/IdentityConstants"
import errorHandler from "actions/errorHandler"

export default React.createClass({

    propTypes: {
        selectedRequest: React.PropTypes.object,
        requests: React.PropTypes.instanceOf(Backbone.Collection)
    },

    getInitialState() {
        return {
            actionPending: false,
            allocationsSavedOnce: false,
            identitiesSavedOnce: false,
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

    onAllocationSave(allocationSource) {
        let { selectedRequest: request } = this.props;
        let promise = Promise.resolve(
            allocationSource.save(allocationSource.pick("compute_allowed"), { patch: true })
        );
        promise
            .then(() => {
                Utils.dispatch(AllocationSourceConstants.UPDATE, {
                    allocation: allocationSource,
                    username: request.get("created_by").username
                })
                this.setState({ allocationsSavedOnce: true });
            })
            .catch(errorHandler);
        return promise;
    },

    onIdentitySave(identity) {
        let { selectedRequest: request } = this.props;
        let username = request.get("created_by").username;
        let quota = new Quota(_.omit(identity.get('quota'), ["id", "uuid"]));
        let promise = Promise.resolve(quota.save())
            .then(
                () => {
                    // The api expects a username query paramater for an admin
                    // to update another users' identity. This will be
                    // changed.
                    let urlByUsername = `${identity.url()}?username=${username}`;
                    return identity.save({ 'quota': quota.pick("id") }, { patch: true, url: urlByUsername })
                }
            );

        promise
            .then(() => {
                Utils.dispatch(IdentityConstants.UPDATE, {
                    identity,
                    username
                });
                this.setState({ identitiesSavedOnce: true });
            })
            .catch(errorHandler);
        return promise;
    },

    onApprove() {
        let { selectedRequest: request } = this.props;
        let { statuses } = this.fetch();
        let status = statuses.findWhere({
            name: "approved"
        });

        this.setState({ actionPending: true });
        let promise = Promise.resolve(AdminResourceRequestActions.updateRequest(request, status));
        promise
            .then(
                // onSuccess, navigate away
                () => browserHistory.push("/application/admin/resource-requests"),

                // onFailure, action is no longer pending, trigger error handler
                err => {
                    this.setState({ actionPending: false })
                    errorHandler(err);
                }
            );
        return promise;
    },

    onDeny(reason) {
        let { selectedRequest: request } = this.props;
        let { statuses } = this.fetch();

        let status = statuses.findWhere({
            name: "denied"
        });

        this.setState({ actionPending: true });
        let promise = Promise.resolve(
            AdminResourceRequestActions.updateRequest(request, status, reason)
        );
        promise
            .then(
                // onSuccess, navigate away
                () => browserHistory.push("/application/admin/resource-requests"),

                // onFailure, action is no longer pending, trigger error handler
                err => {
                    this.setState({ actionPending: false });
                    errorHandler(err);
                }
            )
        return promise;
    },

    onClose() {
        let { selectedRequest: request } = this.props;
        let { statuses } = this.fetch();

        let status = statuses.findWhere({
            name: "closed"
        });

        this.setState({ actionPending: true });
        let promise = Promise.resolve(
            AdminResourceRequestActions.updateRequest(request, status)
        );
        promise
            .then(
                // onSuccess, navigate away
                () => browserHistory.push("/application/admin/resource-requests"),

                // onFailure, action is no longer pending, trigger error handler
                err => {
                    this.setState({ actionPending: false });
                    errorHandler(err);
                }
            )
        return promise;
    },

    fetch() {
        let { selectedRequest: request } = this.props;
        let statuses = stores.StatusStore.getAll();

        let identities;
        if (request) {
            identities = stores.IdentityStore.fetchWhere({
                username: request.get("created_by").username
            });
        }

        let allocationSources;
        if (request) {
            allocationSources = stores.AllocationSourceStore.fetchWhere({
                "username": request.get("created_by").username
            })
        }

        return {
            allocationSources,
            identities,
            statuses
        };
    },

    render() {
        let { allocationSources, identities } = this.fetch();
        let { selectedRequest } = this.props;
        let { actionPending, allocationsSavedOnce, identitiesSavedOnce } = this.state;

        if (actionPending) {
            return (
                <div className="loading"></div>
            );
        }

        let viewProps = {
            request: selectedRequest,
            resourcesChanged: allocationsSavedOnce || identitiesSavedOnce,
            allocationSources,
            identities,
            onAllocationSave: this.onAllocationSave,
            onIdentitySave: this.onIdentitySave,
            onApprove: this.onApprove,
            onDeny: this.onDeny,
            onClose: this.onClose,
        };

        return (
        <ResourceRequestView {...viewProps} />
        );
    }
});
