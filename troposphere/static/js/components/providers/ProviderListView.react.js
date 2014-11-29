/** @jsx React.DOM */

define(
  [
    'react',
    './ProviderList.react'
  ],
  function (React, ProviderList) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection)
      },

      getInitialState: function(){
        return {
          currentProvider: this.props.providers.first()
        }
      },

      handleProviderChange: function(provider){
        this.setState({currentProvider: provider});
      },

      renderStat: function(value, subText, moreInfo){
        return (
          <div className="col-md-3 provider-stat">
            <div>
              <span className="stat">{value}</span>
              <span className="sub-text">{subText}</span>
            </div>
            <div className="more-info">{moreInfo}</div>
          </div>
        )
      },

      renderStats: function(){
        return (
          <div className="row provider-info-section provider-stats">
            {this.renderStat("67%", "(10/168 AUs)", "AUs currently used")}
            {this.renderStat(3, "instances", "Number of instances consuming allocation")}
            {this.renderStat(12, "hours", "Time remaining before allocation runs out")}
            {this.renderStat(13, "AUs/hour", "Rate at which AUs are being used")}
          </div>
        )
      },

      renderCloudList: function(){
        return (
          <ul className="nav nav-stacked provider-list">
            <li className="active">
              <a>iPlant Cloud - Tucson</a>
            </li>
            <li>
              <a>iPlant Cloud - Austin</a>
            </li>
            <li>
              <a>iPlant Workshop Cloud - Tucson</a>
            </li>
          </ul>
        )
      },

      renderName: function(provider){
        return (
          <div className="row">
            <h2>{provider.get('name')}</h2>
          </div>
        )
      },

      renderDescription: function(){
        return (
          <div className="row provider-info-section">
            <h4>Description</h4>
            <p>No Description Provided</p>
          </div>
        )
      },
      
      renderInstanceList: function(){
        return (
          <div className="row provider-info-section">
            <h4>Instances Consuming Allocation</h4>
            <div>
              <p>The following instancs are currently consuming allocation on this provider:</p>
              <table className="table table-striped table-condensed">
                <thead>
                  <tr>
                    <th>Instance</th>
                    <th>Status</th>
                    <th>CPUs</th>
                    <th>AUs/hour</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <a href="/application/projects/3177/instances/0344be18-0bf0-407b-a160-20f33ab1b745">test2</a>
                    </td>
                    <td>active</td>
                    <td>1</td>
                    <td>1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      },

      render: function () {
        var provider = this.state.currentProvider;

        return (
          <div>
            <div className="container">
              <div className="col-md-2">
                <ProviderList providers={this.props.providers}
                              selectedProvider={provider}
                              onSelectedProviderChanged={this.handleProviderChange}
                />
              </div>
              <div className="col-md-10 provider-details">
                {this.renderName(provider)}
                {this.renderStats()}
                {this.renderDescription()}
                {this.renderInstanceList()}
              </div>
            </div>
          </div>
        );

      }

    });

  });
