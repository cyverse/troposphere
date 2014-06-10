/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    './InstanceAttributes.react',
    './InstanceLinks.react',
    './ActionList.react',
    'backbone',
    'components/common/Time.react'
  ],
  function (React, PageHeader, InstanceAttributes, InstanceLinks, ActionList, Backbone, Time) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getStatus: function(instance){
        var status = instance.get('status');
        var statusLight;
        if(status === "active"){
          statusLight = <span className="instance-status-light active"></span>;
        }else if(status === "suspended"){
          statusLight = <span className="instance-status-light suspended"></span>;
        }else if(status === "shutoff"){
          statusLight = <span className="instance-status-light stopped"></span>;
        }

        var capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

        return (
          <li>
            <span className="instance-detail-label">Status</span>
            {statusLight}
            <span className="instance-detail-value">{capitalizedStatus}</span>
          </li>
        );
      },

      getIpAddress: function(instance){
        return (
          <li>
            <span className="instance-detail-label">IP Address</span>
            <span className="instance-detail-value">{instance.get('ip_address')}</span>
          </li>
        );
      },

      getLaunchedDate: function(){
          return (
            <li>
              <span className="instance-detail-label">Launched</span>
              <span className="instance-detail-value">
                <Time date={this.props.instance.get('start_date')}/>
              </span>
            </li>
          );
      },

      getBasedOn: function(){
          return (
            <li>
              <span className="instance-detail-label">Based on</span>
              <span className="instance-detail-value">{'iPlant Base Image v3.0'}</span>
            </li>
          );
      },

      getIdentity: function(){
        var identityId = this.props.instance.get('identity').id;
        var providerName = this.props.provider.get('name');

        return (
          <li>
            <span className="instance-detail-label">Identity</span>
            <span className="instance-detail-value">
              <strong>{identityId}</strong> on <strong>{providerName}</strong>
            </span>
          </li>
        );
      },

      getId: function(){
        var identityId = this.props.instance.get('identity').id;
        var providerName = this.props.provider.get('name');

        return (
          <li>
            <span className="instance-detail-label">ID</span>
            <span className="instance-detail-value">{this.props.instance.id}</span>
          </li>
        );
      },

      render: function () {

        return (
          <div className="instance-details-section">
            <h4>Instance Details</h4>
            <ul>
              {this.getStatus(this.props.instance)}
              {this.getIpAddress(this.props.instance)}
              {this.getLaunchedDate()}
              {this.getBasedOn()}
              {this.getIdentity()}
              {this.getId()}
            </ul>
          </div>
        );
      }

    });

  });
