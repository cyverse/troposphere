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

      render: function () {
        var launchDate = (
          <Time date={this.props.instance.get('start_date')}/>
        );

        var identityId = this.props.instance.id;
        var providerName = this.props.provider.get('name');

        var identityValue = (
          <span></span>
        );

        var detailArray = [
          //{label: 'IP Address', value: '128.196.64.25'},
          {label: 'Launched', value: launchDate},
          {label: 'Based On', value: 'iPlant Base Image v3.0'},
          {label: 'Identity', value: '7 on iPlant Cloud-Tucson'},
          {label: 'ID', value: 'b94d4964-8de3-4965-a87a-f4cf44d33165'}
        ];

        var details = detailArray.map(function(detail){
          return (
            <li>
              <span className="instance-detail-label">{detail.label}</span>
              <span className="instance-detail-value">{detail.value}</span>
            </li>
          );
        });

        return (
          <div className="instance-details-section">
            <h4>Instance Details</h4>
            <ul>
              {this.getStatus(this.props.instance)}
              {this.getIpAddress(this.props.instance)}
              {this.getIdentity()}
              {details}
            </ul>
          </div>
        );
      }

    });

  });
