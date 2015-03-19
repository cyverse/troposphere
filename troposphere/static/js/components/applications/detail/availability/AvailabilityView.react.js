define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      application: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    renderProvider: function(provider){
      return (
        <li key={provider.id}>
          {provider.get('name')}
        </li>
      )
    },

    render: function () {
      var image = this.props.application,
          providers = image.get('machines').filter(function(machine){
            // filter out providers that don't exist
            var providerId = machine.get('provider').id,
                provider = stores.ProviderStore.get(machine.get('provider').id);
            if(!provider) console.warn("Image " + image.id + " showing availability on non-existent provider " + providerId);
            return provider;
          }).map(function(machine){
            // convert machine to providers
            return stores.ProviderStore.get(machine.get('provider').id);
          });

      return (
        <div className='image-availability image-info-segment row'>
          <h4 className="title col-md-2">Available on</h4>
          <div className="content col-md-10">
            <ul className="list-unstyled">
              {providers.map(this.renderProvider)}
            </ul>
          </div>
        </div>
      );
    }

  });

});
