/** @jsx React.DOM */

define(function (require) {
    'use strict';

    //
    // Dependencies
    // ------------
    //

    var React = require('react');

    var VolumeStore   = require('stores/VolumeStore'),
        ProviderStore = require('stores/ProviderStore'),
        IdentityStore = require('stores/IdentityStore');

    var Id          = require('../details/sections/details/Id.react'),
        Status      = require('../details/sections/details/Status.react'),
        Size        = require('../details/sections/details/Size.react'),
        Identity    = require('../details/sections/details/Identity.react');

    //
    // State
    // -----
    //

    function getState(volumeId) {
      return {
        volume: VolumeStore.get(volumeId),
        providers: ProviderStore.getAll()
      };
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function(){
        return getState(this.props.volume.id);
      },

      componentDidMount: function () {
        VolumeStore.addChangeListener(this.updateState);
        ProviderStore.addChangeListener(this.updateState);

        // todo: IdentityStore is only included here because InstanceStore.get(instanceId) is
        // lazy loading, but I'm not sure how to get InstanceStore to know when new
        // identities have been without getting this component to call InstanceStore.getAll()
        // again at the moment.  Figure it out and remove this line.
        IdentityStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        VolumeStore.removeChangeListener(this.updateState);
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
      },

      updateState: function(){
        if (this.isMounted()) this.setState(getState(this.props.volume.id));
      },

      //
      // Render
      // ------
      //

      render: function () {
        var volume = this.state.volume;

        if(volume && this.state.providers) {
          var providerId = volume.get('identity').provider;
          var provider = this.state.providers.get(providerId);

          return (
            <ul>
              <Status volume={volume}/>
              <Size volume={volume}/>
              <Identity volume={volume} provider={provider}/>
              <Id volume={volume}/>
            </ul>
          );
        }

        return (
           <div className="loading"></div>
        );
      }

    });

  });
