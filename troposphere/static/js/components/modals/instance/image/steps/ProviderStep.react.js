define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Provider = require('../components/Provider.react'),
    stores = require('stores');

  return React.createClass({

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function () {
      var instance = this.props.instance;
      return {
        providerId: this.props.providerId || instance.get('provider').id
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
        providerId: this.state.providerId
      });
    },

    onProviderChange: function (newProviderId) {
      this.setState({
        providerId: newProviderId
      });
    },

    renderBody: function (instance) {
      return (
        <div>
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

});
