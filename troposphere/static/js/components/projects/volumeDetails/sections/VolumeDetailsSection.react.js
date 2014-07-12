/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react',
    'url',
    'components/projects/common/ResourceDetail.react'
  ],
  function (React, Backbone, Time, URL, ResourceDetail) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getStatus: function(volume){
        return (
          <ResourceDetail label="Status">
            {"?Attached to Instance Name?"}
          </ResourceDetail>
        );
      },

      getSize: function(volume){
        return (
          <ResourceDetail label="Size">
            {volume.get('size') + " GB"}
          </ResourceDetail>
        );
      },

      getIdentity: function(volume, provider){
        var identityId = volume.get('identity').id;
        var providerName = provider.get('name');

        return (
          <ResourceDetail label="Identity">
            <strong>{identityId}</strong> on <strong>{providerName}</strong>
          </ResourceDetail>
        );
      },

      getId: function(volume){
        return (
          <ResourceDetail label="ID">
            {volume.id}
          </ResourceDetail>
        );
      },

      render: function () {
        var providerId = this.props.volume.get('identity').provider;
        var provider = this.props.providers.get(providerId);

        return (
          <div className="resource-details-section section">
            <h4 className="title">Volume Details</h4>
            <ul>
              {this.getStatus(this.props.volume)}
              {this.getSize(this.props.volume)}
              {this.getIdentity(this.props.volume, provider)}
              {this.getId(this.props.volume)}
            </ul>
          </div>
        );
      }

    });

  });
