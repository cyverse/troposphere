/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores',
    'url'
  ],
  function (React, Backbone, stores, URL) {

    return React.createClass({

      propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function () {
        return this.getState();
      },

      getState: function(){
        var identity = this.props.identities.first();
        return {
          sizes: stores.SizeStore.getAllFor(identity.get('provider_id'), identity.id)
        }
      },

      updateState: function () {
        if (this.isMounted()) this.setState(this.getState());
      },

      componentDidMount: function () {
        stores.SizeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.SizeStore.removeChangeListener(this.updateState);
      },

      getProjectForInstance: function(projects, instance){
        var projectArray = projects.filter(function(project){
          return project.get('instances').filter(function(i){
            return i.id === instance.id
          }).length > 0;
        });

        if(projectArray.length > 0){
          return projectArray[0];
        }else{
          throw new Error("found more or less than 1 project containing the instance")
        }
      },

      renderInstanceTableRow: function(instance, sizes){
        var size = sizes.get(instance.get('size_alias'));
        var numberOfCpus = Number(size.get('cpu'));
        var ausPerCpu = 1;
        var burnRate = ausPerCpu*numberOfCpus;
        var instanceProject = this.getProjectForInstance(this.props.projects, instance);

        var instanceUrl = URL.projectInstance({project: instanceProject, instance: instance});

        return (
          <tr>
            <td>
              <a href={instanceUrl}>{instance.get('name')}</a>
            </td>
            <td>{instance.get('status')}</td>
            <td>{numberOfCpus}</td>
            <td>{burnRate}</td>
          </tr>
        );
      },

      render: function () {
        var sizes = this.state.sizes,
            instances = this.props.instances,
            identity = this.props.identities.first(),
            instancesConsumingAllocation = identity.getInstancesConsumingAllocation(instances);

        if(sizes){
          return (
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
                {
                  instancesConsumingAllocation.map(function(instance){
                    return this.renderInstanceTableRow(instance, sizes);
                  }.bind(this))
                }
              </tbody>
            </table>
          )
        }

        return (
          <div className="loading"></div>
        )
      }
    });

  });
