/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './CloudCapacity.react',
    'stores/SizeStore'
  ],
  function (React, Backbone, CloudCapacity, SizeStore) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        /*
         Display of Cloud capacity. Especially making it clear ~ "this one is
         almost full, launching larger instance sizes may not be possible."
        */

        var providerCapacities = this.props.providers.map(function (provider) {
          var providerId = provider.id;
          var identityId = this.props.identities.findWhere({provider_id: providerId}).id;
          var sizes = SizeStore.getAllFor(providerId, identityId);

          if(sizes){
            return (
              <CloudCapacity key={provider.id} provider={provider} sizes={sizes}/>
            );
          }else{
            return (
              <div key={provider.id} className='loading'></div>
            );
          }
        }.bind(this));

        return (
          <div className="">
            <h2>Cloud Capacity</h2>
            {providerCapacities}
          </div>
        );
      }

    });

  });
