import React from 'react';
import Backbone from 'backbone';
import Router from 'react-router';
import stores from 'stores';
import Glyphicon from 'components/common/Glyphicon.react';
import actions from 'actions';
import ResourceActions from 'actions/ResourceActions';

let RouteHandler = Router.RouteHandler;

let ResourceRequest = React.createClass({
    mixins: [Router.State],

    getInitialState: function(){
      return {
        AUSearch: null,
        currentAllocation: null,
        currentQuota: null,
        quotaSearch: null,
        delta: 525600,
        expire: true,
        response: "",
        request: null,
        canSubmit: false,
        displayAdmin: false
      };
    },

    componentDidMount: function(){
        stores.ResourceRequestStore.addChangeListener(this.updateState);
        stores.AllocationStore.addChangeListener(this.updateState);
        stores.QuotaStore.addChangeListener(this.updateState);

        stores.AllocationStore.getAll();
        stores.QuotaStore.getAll();

        // In case all stores have already been loaded, call updateState manually once.
        this.updateState();
    },

    componentWillUnmount: function(){
        stores.ResourceRequestStore.removeChangeListener(this.updateState);
        stores.AllocationStore.removeChangeListener(this.updateState);
        stores.QuotaStore.removeChangeListener(this.updateState);
    },

    updateState: function(){
        var request = this.state.request || stores.ResourceRequestStore.get(this.getParams().id);
        var quotaId = request.get('current_quota');
        var allocationId = request.get('current_allocation');
        var currentQuota = this.state.currentQuota || stores.QuotaStore.get(quotaId);
        var currentAllocation = this.state.currentAllocation || stores.AllocationStore.get(allocationId);

        // Wait until all data has been fetched from the stores
        if(!request || !currentQuota || !currentAllocation){
            return;
        }

        // Set quota search to current quota if state's quota doesn't exist yet
        function setQuota(){
            return{
                cpu: currentQuota.get('cpu'),
                memory: currentQuota.get('memory'),
                storage: currentQuota.get('storage'),
                storage_count: currentQuota.get('storage_count'),
                suspended_count: currentQuota.get('suspended_count')
            };
        };

        var quotaSearch = this.state.quotaSearch || (currentQuota && setQuota());
        var AUSearch = this.state.AUSearch || currentAllocation.get('threshold') / 60;

        this.setState({
            request: request,
            currentQuota: currentQuota,
            currentAllocation: currentAllocation,
            AUSearch: AUSearch,
            quotaSearch: quotaSearch
        });
    },

    canSubmit: function(){
        var allocationExists = stores.AllocationStore.findWhere({
            threshold: this.state.AUSearch * 60,
            delta: this.state.delta
        }).length > 0;
        var quotaExists = stores.QuotaStore.findWhere(this.state.quotaSearch).length > 0;
        return this.state.response && allocationExists && quotaExists
    },

    handleDisplayChange: function (event){
      this.setState({displayAdmin: !this.state.displayAdmin});
    },

    handleResponseChange: function (event) {
      var response = event.target.value;
      if (response) this.setState({response: response});
    },

    handleQuotaChange: function (event) {
      var quota = event.target.value;
      if (quota) this.setState({quota: quota});
    },

    handleAllocationChange: function (event) {
      var allocation = event.target.value;
      if (allocation) this.setState({allocation: allocation});
    },

    handleApproval: function(e){
        e.preventDefault();
        var resourceRequest = stores.ResourceRequestStore.get(this.getParams().id),
            quota = stores.QuotaStore.findWhere(this.state.quotaSearch).models[0].id,
            allocation = stores.AllocationStore.findWhere({
                threshold: this.state.AUSearch * 60,
                delta: this.state.delta
            }).models[0].id,
            status = stores.StatusStore.findOne({name: "approved"});

        ResourceActions.update({
          request: resourceRequest,
          response: this.state.response,
          quota: quota,
          allocation: allocation,
          status: status.id
        });

    },

    handleDenial: function(e){
      e.preventDefault();
      var resourceRequest = stores.ResourceRequestStore.get(this.getParams().id),
        status = stores.StatusStore.findOne({name: "denied"});

      ResourceActions.update({
        request: resourceRequest,
        response: this.state.response,
        status: status.id
      });
    },

    handleThresholdSearchChange: function(e){
      this.setState({
        AUSearch: e.target.value
      });
    },

    makeNewQuota: function(e){
        actions.QuotaActions.create(this.state.quotaSearch);
    },

    makeNewAllocation: function(e){
        actions.AllocationActions.create({"threshold": this.state.AUSearch * 60, "delta": this.state.delta});
    },

    onExpireClick: function(expire){
      this.setState({
          delta: expire ? 525600: -1,
          expire,
      });
    },

    renderResourceStatus: function(){
        let allocation = stores.AllocationStore.findWhere({"threshold": parseInt(this.state.AUSearch) * 60, "delta": this.state.delta});
        let allocationExists = allocation && allocation.length > 0;

        let quota = stores.QuotaStore.findWhere(this.state.quotaSearch);
        let quotaExists = quota && quota.length > 0;

        if (!quotaExists || !allocationExists) {
            return(
                <div>
                    <p>
                        These resources do not exist. Click <a href="#" onClick={ (e) =>  {
                            e.preventDefault();
                            quotaExists || this.makeNewQuota();
                            allocationExists || this.makeNewAllocation();
                        } }>here</a> to create them.
                    </p>
                </div>
            );
        }
    },

    onQuotaSearchChange: function(e){
        var currentQuotaSearch = this.state.quotaSearch;
        currentQuotaSearch[e.target.id] = Number(e.target.value);
        this.setState({
            quotaSearch: currentQuotaSearch
        });
    },

    renderAdminDetails: function(){
        var request = this.state.request,
            currentQuota = this.state.currentQuota,
            currentAllocation = this.state.currentAllocation,
            quotaSearch = this.state.quotaSearch,
            statuses = stores.StatusStore.getAll(),
            currentQuotaString = 'N/A',
            currentAllocationString = 'N/A';

        if (!request || !currentQuota || !currentAllocation || !statuses || !quotaSearch) return <div className="loading"/>;

        var currentCPU = "  CPU: " + currentQuota.get('cpu'),
          currentMemory = "  Memory: " + currentQuota.get('memory'),
          currentStorage = "  Storage: " + currentQuota.get('storage'),
          currentStorageCount = "  Storage Count: " + currentQuota.get('storage_count'),
          currentSuspendedCount = "  Suspended: " + currentQuota.get('suspended_count'),
          currentThreshold = "  Threshold: " + currentAllocation.get('threshold') + " (" + (currentAllocation.get('threshold') / 60) + " AU)",
          currentDelta = "  Delta: " + currentAllocation.get('delta'),
          currentQuotaString = currentCPU + currentMemory + currentStorage + currentStorageCount + currentSuspendedCount,
          currentAllocationString = currentThreshold + currentDelta;

        return(
          <div className="admin-detail">
            <div className="request-info">
              <div className="user-info">
                <span className="name"><h4>For user:</h4>&nbsp;<h5>{request.get('user').username}</h5></span>
                <span className="name"><h4>Created by:</h4>&nbsp;<h5>{request.get('created_by').username}</h5></span>
              </div>
              <h4>Request: </h4>{request.get('request')}
              <h4>Description: </h4>{request.get('description')}
              <h4>Admin message: </h4>{request.get('admin_message')}
            </div>
            <div className="request-actions">
              <div className="quota-change">
                <h4>Current quota: </h4>{currentQuotaString}
                <h4>New quota: </h4>
                <label htmlFor="cpu">CPU: </label>
                <input className="form-control" id="cpu" type="number" value={this.state.quotaSearch.cpu} onChange={this.onQuotaSearchChange} />
                <label htmlFor="memory">Memory (GB): </label>
                <input className="form-control" id="memory" type="number" value={this.state.quotaSearch.memory} onChange={this.onQuotaSearchChange} />
                <label htmlFor="storage">Storage: </label>
                <input className="form-control" id="storage" type="number" value={this.state.quotaSearch.storage} onChange={this.onQuotaSearchChange} />
                <label htmlFor="storage_count">Storage Count: </label>
                <input className="form-control" id="storage_count" type="number" value={this.state.quotaSearch.storage_count} onChange={this.onQuotaSearchChange} />
                <label htmlFor="suspended_count">Suspended Count: </label>
                <input className="form-control" id="suspended_count" type="number" value={this.state.quotaSearch.suspended_count} onChange={this.onQuotaSearchChange} />
              </div>
              <div className="allocation-change">
                <h4>Current allocation: </h4>{currentAllocationString}
                <div>
                  <h4>New allocation: </h4>
                  <div>
                    <label htmlFor="au">AU: </label>
                    <input id="au" className="form-control" type="number" value={this.state.AUSearch} onChange={this.handleThresholdSearchChange} />
                  </div>
                </div>
                <div className="radio-buttons">
                  <h4>Expiring allocation? </h4>
                  <input id="expire-enabled" type="radio" name="expire" defaultChecked onClick={this.onExpireClick.bind(this, true)}/>
                  <label htmlFor="expire-enabled">Yes</label>
                  <br/>
                  <input id="expire-disabled" type="radio" name="expire" onClick={this.onExpireClick.bind(this, false)}/>
                  <label htmlFor="expire-disabled">No</label>
                </div>
              </div>
              <div className="form-group admin-response">
                <h4>Response:</h4>
                <br />
                <textarea type="text" form="admin" value={this.state.value} onChange={this.handleResponseChange}/>
              </div>
              {this.renderResourceStatus()}
              <div className="buttons">
                <button disabled={!this.canSubmit()} onClick={this.handleApproval} type="button" className="btn btn-default btn-sm">Approve</button>
                <button onClick={this.handleDenial} type="button" className="btn btn-default btn-sm">Deny</button>
              </div>
            </div>
          </div>
        );
    },

    render: function () {
      return (
        <div className="request-admin pull-right">
          {this.renderAdminDetails()}
          <RouteHandler />
        </div>
      );
    }
});

export default ResourceRequest;
