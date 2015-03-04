define(function (require) {
    'use strict';

    //
    // Dependencies
    // ------------
    //

    var React = require('react'),
        stores = require('stores');

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

    function getState(project, instanceId) {
      return {
        instance: stores.InstanceStore.get(instanceId),
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
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function(){
        return getState(this.props.project, this.props.instance.id);
      },

      componentDidMount: function () {
        stores.InstanceStore.addChangeListener(this.updateState);
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
      },

      updateState: function(){
        if (this.isMounted()) this.setState(getState(this.props.project, this.props.instance.id));
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

          return (
            <ul>
              <Id instance={instance}/>
              <Status instance={instance}/>
              <Size instance={instance}/>
              <IpAddress instance={instance}/>
              <LaunchDate instance={instance}/>
              <CreatedFrom instance={instance}/>
              <Identity instance={instance} provider={provider}/>
            </ul>
          );
        }

        return (
           <div className="loading"></div>
        );
      }

    });

  });
