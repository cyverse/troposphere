define(function(require) {

  var React = require('react'),
      Backbone = require('backbone'),
      Provider = require('../request_image/ImageProvider.react'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function(){
      var instance = this.props.instance;
      return {
        providerId: instance.get('provider').id
      }
    },

    isSubmittable: function(){
      var hasProviderId        = !!this.state.providerId;
      return hasProviderId;
    },

    onNext: function(){
      this.props.onNext({
        providerId: this.state.providerId
      });
    },

    onProviderChange: function(newProviderId){
      this.setState({
        providerId: newProviderId
      });
    },

    renderBody: function (instance) {
      return (
        <div>
          <p>
            {
              "Please select the provider you would like this image to be available on. If you would " +
              "like the image to be available on multiple clouds please contact support through the Feedback " +
              "button in footer and we will be help you out."
            }
          </p>
          <Provider
            providerId={this.state.providerId}
            onChange={this.onProviderChange}
          />
        </div>
      );
    },

    render: function () {
      var instance = this.props.instance;

      return (
        <div>
          <div className="modal-body">
            {this.renderBody(instance)}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default cancel-button pull-left" onClick={this.props.onPrevious}>
              <span className="glyphicon glyphicon-chevron-left"></span>
              Back
            </button>
            <button type="button" className="btn btn-primary cancel-button" onClick={this.onNext} disabled={!this.isSubmittable()}>
              Next
            </button>
          </div>
        </div>
      );
    }

  });

});
