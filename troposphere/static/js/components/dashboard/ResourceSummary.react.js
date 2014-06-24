/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        /*
          Summary of resources in use (sorted by provider/identity?) incl. Instances, Volumes,
          and a simplified quota representation (?). I imagine they'll be able to click on these
          to see details for cloud resources or click on the provider or the quota to see that provider.
         */

        var provider = this.props.provider;

        var identityData = this.props.identities.where({provider_id: provider.id}).map(function(identity){
          var instancesCreatedUnderIdentity = this.props.instances.filter(function(instance){
            return instance.get('identity').provider === provider.id;
          });
          var instanceCount = instancesCreatedUnderIdentity.length;

          var volumesCreatedUnderIdentity = this.props.instances.filter(function(volume){
            return volume.get('identity').provider === provider.id;
          });
          var volumeCount = volumesCreatedUnderIdentity.length;

          return (
            <tr key={identity.id}>
              <td>{identity.id}</td>
              <td>{instanceCount}</td>
              <td>{volumeCount}</td>
            </tr>
          );
        }.bind(this));

        var style = {
          "margin-left": "40px"
        };

        return (
          <div className="" style={style}>
            <h3>{provider.get('location')}</h3>
            <table className="table table-condensed">
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Instance Count</th>
                  <th>Volume Count</th>
                </tr>
              </thead>
              <tbody>
                {identityData}
              </tbody>
            </table>
          </div>
        );
      }

    });

  });
