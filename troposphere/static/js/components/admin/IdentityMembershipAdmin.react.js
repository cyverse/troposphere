import React from 'react/addons';
import Router from 'react-router';
import stores from 'stores';
import actions from 'actions';
import IdentityMembershipActions from 'actions/IdentityMembershipActions';

export default React.createClass({

    mixins: [Router.State],

    getInitialState: function () {
      return {
      };
    },
    render: function () {

      var identityMembership = stores.IdentityMembershipStore.get(this.getParams().identityMembershipId);

      if (!identityMembership || !quotas || !allocations || !statuses) return <div className="loading"/>;

      if (identityMembership.get('current_quota') && identityMembership.get('current_allocation')) {

        var currentQuota = stores.QuotaStore.get(identityMembership.get('current_quota')),
          currentAllocation = stores.AllocationStore.get(identityMembership.get('current_allocation'));

        if (!currentQuota || !currentAllocation) return <div className="loading"/>;

        var currentCPU = "  CPU: " + currentQuota.get('cpu'),
          currentMemory = "  Memory: " + currentQuota.get('memory'),
          currentStorage = "  Storage: " + currentQuota.get('storage'),
          currentStorageCount = "  Storage Count: " + currentQuota.get('storage_count'),
          currentSuspendedCount = "  Suspended: " + currentQuota.get('suspended_count'),
          currentThreshold = "  Threshold: " + currentAllocation.get('threshold') + " (" + (currentAllocation.get('threshold') / 60) + " AU)",
          currentDelta = "  Delta: " + currentAllocation.get('delta');

        var currentQuotaString = currentCPU + currentMemory + currentStorage + currentStorageCount + currentSuspendedCount,
          currentAllocationString = currentThreshold + currentDelta;

      }

      else {
        var currentQuotaString = 'N/A',
          currentAllocationString = 'N/A';
      }

      return (
        <div className="admin-detail">
          <div><strong>User:</strong> {identityMembership.get('user').username}</div>
          <div><strong>Created by:</strong> {identityMembership.get('created_by').username}</div>
          <div><strong>Admin message:</strong> {identityMembership.get('admin_message')}</div>
          <div><strong>Request:</strong> {identityMembership.get('request')}</div>
          <div><strong>Description:</strong> {identityMembership.get('description')}</div>
          <div><strong>Current quota:</strong>{currentQuotaString}</div>
          <div><strong>Current allocation:</strong>{currentAllocationString}</div>
          <div>
            <label>New quota:&nbsp;</label>
            <select value={this.state.quota} onChange={this.handleQuotaChange}
                    ref="selectedQuota">{quotas.map(function (quota) {
              return (
                <option value={quota.id} key={quota.id}>
                  CPU: {quota.get('cpu')}&nbsp;
                  Memory: {quota.get('memory')}&nbsp;
                  Storage: {quota.get('storage')}&nbsp;
                  Storage Count: {quota.get('storage_count')}&nbsp;
                  Suspended: {quota.get('suspended_count')}&nbsp;
                </option>
              );
            })}
            </select>
          </div>
          <div>
            <label>New allocation:&nbsp;</label>
            <select value={this.state.allocation} onChange={this.handleAllocationChange}
                    ref="selectedAllocation">{allocations.map(function (allocation) {
              return (
                <option value={allocation.id} key={allocation.id}>
                  Threshold: {allocation.get('threshold')}&nbsp;
                  Delta: {allocation.get('delta')}&nbsp;
                </option>
              );
            })}
            </select>
          </div>
          <div className="form-group">
            <strong>Response:</strong>
            <br />
            <textarea type="text" form="admin" value={this.state.value} cols="60" rows="8"
                      onChange={this.handleResponseChange}/>
          </div>
          <button onClick={this.handleResponseSubmission} type="button" className="btn btn-default btn-sm">Approve
          </button>
          <button onClick={this.handleResponseSubmission} type="button" className="btn btn-default btn-sm">Deny</button>
        </div>
      );
    }
});
