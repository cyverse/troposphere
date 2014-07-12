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
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        size: React.PropTypes.instanceOf(Backbone.Model).isRequired
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

        var style = {};
        var capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
        if(capitalizedStatus === "Error") {
          capitalizedStatus = "Launch failed. Atmosphere at capacity.";
          style = {
            color: "#d44950"
          }
        }

        return (
          <ResourceDetail label="Status">
            {statusLight}
            <span style={style}>{capitalizedStatus}</span>
          </ResourceDetail>
        );
      },

      getSize: function(size){
        return (
          <ResourceDetail label="Size">
            {size.formattedDetails()}
          </ResourceDetail>
        );
      },

      getIpAddress: function(instance){
        return (
          <ResourceDetail label="IP Address">
            {instance.get('ip_address')}
          </ResourceDetail>
        );
      },

      getLaunchedDate: function(instance){
        return (
          <ResourceDetail label="Launched">
            <Time date={instance.get('start_date')}/>
          </ResourceDetail>
        );
      },

      getBasedOn: function(instance){
        var applicationUrl = URL.application({id: instance.get('application_uuid')}, {absolute: true});
        return (
          <ResourceDetail label="Based on">
            <a href={applicationUrl}>{instance.get('application_name')}</a>
          </ResourceDetail>
        );
      },

      getIdentity: function(instance, provider){
        var identityId = instance.get('identity').id;
        var providerName = provider.get('name');

        return (
          <ResourceDetail label="Identity">
            <strong>{identityId}</strong> on <strong>{providerName}</strong>
          </ResourceDetail>
        );
      },

      getId: function(instance){
        return (
          <ResourceDetail label="ID">
            {instance.id}
          </ResourceDetail>
        );
      },

      render: function () {

        return (
          <div className="resource-details-section section">
            <h4 className="title">Instance Details</h4>
            <ul>
              {this.getStatus(this.props.instance)}
              {this.getSize(this.props.size)}
              {this.getIpAddress(this.props.instance)}
              {this.getLaunchedDate(this.props.instance)}
              {this.getBasedOn(this.props.instance)}
              {this.getIdentity(this.props.instance, this.props.provider)}
              {this.getId(this.props.instance)}
            </ul>
          </div>
        );
      }

    });

  });
