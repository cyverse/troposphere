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
          <li>
            <span>Status</span>
            {statusLight}
            <span style={style}>{capitalizedStatus}</span>
          </li>
        );
      },

      getSize: function(size){
        return (
          <li>
            <span>Size</span>
            <span>{size.formattedDetails()}</span>
          </li>
        );
      },

      getIpAddress: function(instance){
        return (
          <li>
            <span>IP Address</span>
            <span>{instance.get('ip_address')}</span>
          </li>
        );
      },

      getLaunchedDate: function(){
          return (
            <li>
              <span>Launched</span>
              <span>
                <Time date={this.props.instance.get('start_date')}/>
              </span>
            </li>
          );
      },

      getBasedOn: function(){
        var applicationUrl = URL.application({id: this.props.instance.get('application_uuid')}, {absolute: true});
        return (
          <li>
            <span>Based on</span>
            <span>
              <a href={applicationUrl}>{this.props.instance.get('application_name')}</a>
            </span>
          </li>
        );
      },

      getIdentity: function(){
        var identityId = this.props.instance.get('identity').id;
        var providerName = this.props.provider.get('name');

        return (
          <li>
            <span>Identity</span>
            <span>
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
            <span>ID</span>
            <span>{this.props.instance.id}</span>
          </li>
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
