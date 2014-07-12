/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react',
    'url'
  ],
  function (React, Backbone, Time, URL) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getStatus: function(volume){
        return (
          <li>
            <span className="instance-detail-label">Status</span>
            <span className="instance-detail-value">?Attached to Instance Name?</span>
          </li>
        );
      },

      getSize: function(volume){
        return (
          <li>
            <span className="instance-detail-label">Size</span>
            <span className="instance-detail-value">{volume.get('size') + " GB"}</span>
          </li>
        );
      },

      getIdentity: function(volume, provider){
        var identityId = volume.get('identity').id;
        var providerName = provider.get('name');

        return (
          <li>
            <span className="instance-detail-label">Identity</span>
            <span className="instance-detail-value">
              <strong>{identityId}</strong> on <strong>{providerName}</strong>
            </span>
          </li>
        );
      },

      getId: function(volume){
        return (
          <li>
            <span className="instance-detail-label resource-detail-label">ID</span>
            <span className="instance-detail-value resource-detail-value">{volume.id}</span>
          </li>
        );
      },

      render: function () {
        var providerId = this.props.volume.get('identity').provider;
        var provider = this.props.providers.get(providerId);

        return (
          <div className="instance-details-section section">
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
