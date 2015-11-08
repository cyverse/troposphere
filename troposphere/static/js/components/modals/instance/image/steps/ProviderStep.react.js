import React from 'react/addons';
import Backbone from 'backbone';
import Provider from '../components/Provider.react';
import stores from 'stores';

export default React.createClass({
    displayName: "ImageWizard-ProviderStep",

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function () {
      var instance = this.props.instance;
      return {
        providerId: this.props.providerId || instance.get('provider').id,
        minCPU: "0",
        minMem: "0"
      }
    },

    isSubmittable: function () {
      var hasProviderId = !!this.state.providerId;
      return hasProviderId;
    },

    onPrevious: function () {
      this.props.onPrevious({
        providerId: this.state.providerId
      });
    },

    onNext: function () {
      this.props.onNext({
        minCPU: this.state.minCPU,
        minMem: this.state.minMem,
        providerId: this.state.providerId
      });
    },

    onProviderChange: function (newProviderId) {
      this.setState({
        providerId: newProviderId
      });
    },

    handleCPUChange: function(e){
      this.setState({minCPU: e.target.value});
    },

    handleMemChange: function(e){
      this.setState({minMem: e.target.value});
    },

    renderProvider: function (instance) {
      return (
        <div>
          <Provider
            providerId={this.state.providerId}
            onChange={this.onProviderChange}/>
        </div>
      );
    },

    renderRequirementsStep: function(){
      return (
        <div id="min-requirements" className="min-requirements collapse">
          <div className="min-cpu clearfix">
            # of CPUs: {this.state.minCPU}
            <input type = "range" className = "slider"
              value = {this.state.minCPU}
              min = "0"
              max = "16"
              step = "1"
              onChange = {this.handleCPUChange} />
            <span className="pull-left">0</span>
            <span className="pull-right">16</span>
          </div>

          <div className="min-mem">
            Memory: {this.state.minMem} GB
            <input type = "range" className = "slider"
              value = {this.state.minMem}
              min = "0"
              max = "16"
              step = "2"
              onChange = {this.handleMemChange} />
            <span className="pull-left">0</span>
            <span className="pull-right">16</span>
          </div>
        </div>
      );
    },

    render: function () {
      var instance = this.props.instance;

      return (
        <div>
          <div className="modal-body">
            {this.renderProvider(instance)}
            <a role="button" data-toggle="collapse" href="#min-requirements" aria-expanded="true">
              Minimum Requirements (optional)
            </a>
            {this.renderRequirementsStep()}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default cancel-button pull-left" onClick={this.onPrevious}>
              <span className="glyphicon glyphicon-chevron-left"></span>
              Back
            </button>
            <button type="button" className="btn btn-primary cancel-button" onClick={this.onNext}
                    disabled={!this.isSubmittable()}>
              Next
            </button>
          </div>
        </div>
      );
    }
});
