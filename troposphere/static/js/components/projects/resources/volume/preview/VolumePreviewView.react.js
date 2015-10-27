define(function (require) {
  'use strict';

  var React = require('react/addons'),
    stores = require('stores'),
    Id = require('../details/sections/details/Id.react'),
    Status = require('../details/sections/details/Status.react'),
    Size = require('../details/sections/details/Size.react'),
    Identity = require('../details/sections/details/Identity.react');

  return React.createClass({
    displayName: "VolumePreviewView",

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var volume = stores.VolumeStore.get(this.props.volume.id);

      if (!volume) return <div className="loading"></div>;

      return (
        <ul>
          <Status volume={volume}/>
          <Size volume={volume}/>
          <Identity volume={volume}/>
          <Id volume={volume}/>
        </ul>
      );
    }
  });

});
