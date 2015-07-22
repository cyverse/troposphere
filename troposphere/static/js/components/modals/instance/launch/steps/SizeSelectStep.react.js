define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    stores = require('stores'),
    InstanceSizeSelect = require('../components/InstanceSizeSelect.react');

  var ENTER_KEY = 13;
  var selectedSize, selectedIdentity;

  return React.createClass({
    propTypes: {
      identity: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      size: React.PropTypes.instanceOf(Backbone.Model),
      onPrevious: React.PropTypes.func.isRequired,
      onNext: React.PropTypes.func.isRequired,
    },


    getInitialState: function () {
      return {
        size: this.props.size
      };
    },
    isSubmittable: function () {
      var sizes = stores.SizeStore.getAll(),
        providers = stores.ProviderStore.getAll(),
        instances = stores.InstanceStore.getAll(),
        identity = this.props.identity,
        providerSizes,
        size;

      providerSizes = stores.SizeStore.fetchWhere({
        provider__id: identity.get('provider').id,
        page_size: 100
      });

      if (!providers || !sizes || !providerSizes || !instances) {
        return false;
      }

      if (!this.state.size) {
        return false;
      }
      var selectedSize = this.state.size;
      var hasAllocationAvailable = this.hasAvailableAllocation(identity),
        hasEnoughQuotaForCpu = this.hasEnoughQuotaForCpu(identity, selectedSize, sizes, instances),
        hasEnoughQuotaForMemory = this.hasEnoughQuotaForMemory(identity, selectedSize, sizes, instances);

      return (
        hasAllocationAvailable &&
        hasEnoughQuotaForCpu &&
        hasEnoughQuotaForMemory
      );
    },

    hasEnoughQuotaForCpu: function (identity, size, sizes, instances) {
      var quota = identity.get('quota'),
        maximumAllowed = quota.cpu,
        projected = size.get('cpu'),
        currentlyUsed = identity.getCpusUsed(instances, sizes);

      return (projected + currentlyUsed) <= maximumAllowed;
    },

    hasEnoughQuotaForMemory: function (identity, size, sizes, instances) {
      var quota = identity.get('quota'),
        maximumAllowed = quota.memory,
        projected = size.get('mem'),
        currentlyUsed = identity.getMemoryUsed(instances, sizes);

      return (projected + currentlyUsed) <= maximumAllowed;
    },

    hasAvailableAllocation: function (identity) {
      var allocation = identity.get('allocation'),
        allocationConsumed = allocation.current,
        allocationTotal = allocation.threshold,
        allocationRemaining = allocationTotal - allocationConsumed;

      return allocationRemaining > 0;
    },


    componentDidMount: function () {
      stores.ProviderStore.addChangeListener(this.updateState);
      stores.IdentityStore.addChangeListener(this.updateState);
      stores.SizeStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ProviderStore.removeChangeListener(this.updateState);
      stores.IdentityStore.removeChangeListener(this.updateState);
      stores.SizeStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    confirm: function () {
      //Test if information is valid before continuing
      this.props.onNext(this.state)
    },
    onBack: function () {
      this.props.onPrevious(this.state);
    },
    handleKeyDown: function (e) {
      var text = e.target.value;
      if (e.which === ENTER_KEY) {
        e.preventDefault();
      }
    },

    onSizeChange: function (e) {
      var newSizeId = e.target.value;
      var providerSizes = stores.SizeStore.fetchWhere({
        provider__id: this.props.identity.get('provider').id,
        page_size: 100
      });
      selectedSize = providerSizes.get(newSizeId);
      this.setState({size: selectedSize});
    },

    //
    // Render
    // ------
    //

    renderAllocationWarning: function (identity) {
      if (!this.hasAvailableAllocation(identity)) {
        return (
          <div className="alert alert-danger">
            <Glyphicon name='warning-sign'/>
            <strong>{"Uh oh!"}</strong>
            {
              " Looks like you don't have any AUs available.  In order to launch instances, you need " +
              "to have AUs free.  You will be able to launch again once your AUs have been reset."
            }
          </div>
        );
      }
    },

    renderProgressBar: function (message, currentlyUsedPercent, projectedPercent, overQuotaMessage) {
      var currentlyUsedStyle = {width: currentlyUsedPercent + "%"},
        projectedUsedStyle = {width: projectedPercent + "%", opacity: "0.6"},
        totalPercent = currentlyUsedPercent + projectedPercent,
        barTypeClass;

      if (totalPercent <= 50) {
        barTypeClass = "progress-bar-success";
      } else if (totalPercent <= 100) {
        barTypeClass = "progress-bar-warning";
      } else {
        barTypeClass = "progress-bar-danger";
        projectedUsedStyle.width = (100 - currentlyUsedPercent) + "%";
        message = overQuotaMessage;
      }

      return (
        <div className="quota-consumption-bars">
          <div className="progress">
            <div className="value">{Math.round(currentlyUsedPercent + projectedPercent) + "%"}</div>
            <div className={"progress-bar " + barTypeClass} style={currentlyUsedStyle}></div>
            <div className={"progress-bar " + barTypeClass} style={projectedUsedStyle}></div>
          </div>
          <div>{message}</div>
        </div>
      );
    },

    renderCpuConsumption: function (identity, size, sizes, instances) {
      var quota = identity.get('quota'),
        maximumAllowed = quota.cpu,
        projected = size.get('cpu'),
        currentlyUsed = identity.getCpusUsed(instances, sizes),
      // convert to percentages
        projectedPercent = projected / maximumAllowed * 100,
        currentlyUsedPercent = currentlyUsed / maximumAllowed * 100,
        message = (
          "You will use " + (Math.round(currentlyUsed + projected)) + " of " + maximumAllowed + " allotted CPUs."
        ),
        overQuotaMessage = (
          <div>
            <strong>CPU quota exceeded.</strong>
            <span>{" Choose a smaller size or terminate a running instance."}</span>
          </div>
        );

      return this.renderProgressBar(message, currentlyUsedPercent, projectedPercent, overQuotaMessage);
    },

    renderMemoryConsumption: function (identity, size, sizes, instances) {
      var quota = identity.get('quota'),
        maximumAllowed = quota.memory,
        projected = size.get('mem'),
        currentlyUsed = identity.getMemoryUsed(instances, sizes),
      // convert to percentages
        projectedPercent = projected / maximumAllowed * 100,
        currentlyUsedPercent = currentlyUsed / maximumAllowed * 100,
        message = (
          "You will use " + (Math.round(currentlyUsed + projected)) + " of " + maximumAllowed + " allotted GBs of Memory."
        ),
        overQuotaMessage = (
          <div>
            <strong>Memory quota exceeded.</strong>
            <span>{" Choose a smaller size or terminate a running instance."}</span>
          </div>
        );

      return this.renderProgressBar(message, currentlyUsedPercent, projectedPercent, overQuotaMessage);
    },

    render: function () {
      var sizes = stores.SizeStore.getAll(),
        instances = stores.InstanceStore.getAll(),
        selectedIdentity = this.props.identity,
        providerSizes,
        size;

      if (!sizes || !instances) return <div className="loading"></div>;

      if (!selectedIdentity) return <div className="loading"></div>;

      providerSizes = stores.SizeStore.fetchWhere({
        provider__id: selectedIdentity.get('provider').id,
        page_size: 100
      });

      if (!providerSizes) return <div className="loading"></div>;

      this.state.size = this.state.size || providerSizes.first();
      size = this.state.size;

      return (
        <div>
          <div role='form'>
            {this.renderAllocationWarning(selectedIdentity)}

            <div className="modal-section form-horizontal">
              <h4>Select an Instance Size</h4>


              <div className='form-group'>
                <label htmlFor='size' className="col-sm-3 control-label">Instance Size</label>

                <div className="col-sm-9">
                  <InstanceSizeSelect
                    sizeId={this.state.size.id}
                    sizes={providerSizes}
                    onChange={this.onSizeChange}
                    />
                </div>
              </div>

              <div className='form-group' className="modal-section">
                <h4>Projected Resource Usage</h4>
                {this.renderCpuConsumption(selectedIdentity, size, sizes, instances)}
                {this.renderMemoryConsumption(selectedIdentity, size, sizes, instances)}
              </div>

            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default pull-left" onClick={this.onBack}>
              <span className="glyphicon glyphicon-chevron-left"></span>
              Back
            </button>
            <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
              Continue
            </button>
          </div>

        </div>
      );
    }


  });

});
