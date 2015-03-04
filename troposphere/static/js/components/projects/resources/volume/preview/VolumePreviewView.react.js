define(function (require) {
    'use strict';

    //
    // Dependencies
    // ------------
    //

    var React = require('react'),
        stores   = require('stores');

    var Id          = require('../details/sections/details/Id.react'),
        Status      = require('../details/sections/details/Status.react'),
        Size        = require('../details/sections/details/Size.react'),
        Identity    = require('../details/sections/details/Identity.react');

    //
    // State
    // -----
    //

    function getState(project, volumeId) {
      return {
        volume: stores.VolumeStore.get(volumeId),
        providers: stores.ProviderStore.getAll()
      };
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function(){
        return getState(this.props.project, this.props.volume.id);
      },

      componentDidMount: function () {
        stores.VolumeStore.addChangeListener(this.updateState);
        stores.ProviderStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.VolumeStore.removeChangeListener(this.updateState);
        stores.ProviderStore.removeChangeListener(this.updateState);
      },

      updateState: function(){
        if (this.isMounted()) this.setState(getState(this.props.project, this.props.volume.id));
      },

      //
      // Render
      // ------
      //

      render: function () {
        var volume = this.state.volume;

        if(volume && this.state.providers) {
          var providerId = volume.get('provider');
          var provider = this.state.providers.get(providerId);

          return (
            <ul>
              <Status volume={volume} instances={this.props.instances}/>
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
