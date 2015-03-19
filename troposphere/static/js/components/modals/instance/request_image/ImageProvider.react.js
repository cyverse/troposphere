define(function (require) {

  var React = require('react'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      providerId: React.PropTypes.number.isRequired
    },

    handleChange: function(e){
      this.props.onChange(e.target.value)
    },

    renderProvider: function(provider){
      return (
        <option key={provider.id} value={provider.id}>
          {provider.get('location')}
        </option>
      )
    },

    render: function () {
      var providerId = this.props.providerId,
          providers = stores.ProviderStore.getAll(),
          options = providers.map(this.renderProvider);

      return (
        <div className="form-group">
          <label htmlFor="provider" className="control-label">Cloud for Deployment</label>
          <div className="help-block">
            Select the cloud provider on which you plan to use this image.
          </div>
          <select value={providerId} name="provider" className="form-control" onChange={this.handleChange}>
            {options}
          </select>
        </div>
      );
    }

  });

});
