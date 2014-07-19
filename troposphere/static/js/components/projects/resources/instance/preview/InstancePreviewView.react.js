/** @jsx React.DOM */

define(function (require) {
    'use strict';

    //
    // Dependencies
    // ------------
    //

    var React = require('react');

    var InstanceStore = require('stores/InstanceStore'),
        ProviderStore = require('stores/ProviderStore'),
        IdentityStore = require('stores/IdentityStore'),
        SizeStore     = require('stores/SizeStore');

    var Id          = require('../details/sections/details/Id.react'),
        Status      = require('../details/sections/details/Status.react'),
        Size        = require('../details/sections/details/Size.react'),
        IpAddress   = require('../details/sections/details/IpAddress.react'),
        LaunchDate  = require('../details/sections/details/LaunchDate.react'),
        CreatedFrom = require('../details/sections/details/CreatedFrom.react'),
        Identity    = require('../details/sections/details/Identity.react');

    //
    // State
    // -----
    //

    function getState(instanceId) {
      return {
        instance: InstanceStore.get(instanceId),
        providers: ProviderStore.getAll()
      };
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function(){
        return getState(this.props.instance.id);
      },

      componentDidMount: function () {
        InstanceStore.addChangeListener(this.updateState);
        ProviderStore.addChangeListener(this.updateState);

        // todo: IdentityStore is only included here because InstanceStore.get(instanceId) is
        // lazy loading, but I'm not sure how to get InstanceStore to know when new
        // identities have been without getting this component to call InstanceStore.getAll()
        // again at the moment.  Figure it out and remove this line.
        IdentityStore.addChangeListener(this.updateState);
        SizeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        InstanceStore.removeChangeListener(this.updateState);
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
        SizeStore.removeChangeListener(this.updateState);
      },

      updateState: function(){
        if (this.isMounted()) this.setState(getState(this.props.instance.id));
      },

      //
      // Render
      // ------
      //

      render: function () {
        var instance = this.state.instance;
        if(instance && this.state.providers) {
          var providerId = instance.get('identity').provider;
          var provider = this.state.providers.get(providerId);

          var identityId = instance.get('identity').id;
          var sizeId = instance.get('size_alias');
          var sizes = SizeStore.getAllFor(providerId, identityId);
          if(sizes) {
            var size = sizes.get(sizeId);

            return (
              <ul>
                <Id instance={instance}/>
                <Status instance={instance}/>
                <Size size={size}/>
                <IpAddress instance={instance}/>
                <LaunchDate instance={instance}/>
                <CreatedFrom instance={instance}/>
                <Identity instance={instance} provider={provider}/>
              </ul>
            );
          }
        }

        return (
           <div className="loading"></div>
        );
      }

    });

  });
