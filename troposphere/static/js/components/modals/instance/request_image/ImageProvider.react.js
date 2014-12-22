/** @jsx React.DOM */

define(
  [
    'react',
    'stores'
  ],
  function (React, stores) {

    return React.createClass({

      propTypes: {
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.string.isRequired
      },

      handleChange: function(e){
        this.props.onChange(e.target.value)
      },

      renderProvider: function(provider){
        return (
          <option value={provider.id}>{provider.get('location')}</option>
        )
      },

      render: function () {
        var providers = stores.ProviderStore.getAll();

        var options = providers.map(this.renderProvider);

        return (
          <div className="form-group">
            <label htmlFor="provider" className="control-label">Cloud for Deployment</label>
            <div className="help-block">
              Select the cloud provider on which you plan to use this image.
            </div>
            <select value={this.props.value} name="provider" className="form-control" onChange={this.handleChange}>
              {options}
            </select>
          </div>
        );
      }

    });

  });
