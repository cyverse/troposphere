define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      BreadcrumbBar = require('components/projects/common/BreadcrumbBar.react'),
      InstanceInfoSection = require('./sections/InstanceInfoSection.react'),
      InstanceDetailsSection = require('./sections/InstanceDetailsSection.react'),
      InstanceActionsAndLinks = require('./actions/InstanceActionsAndLinks.react'),
      URL = require('url'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getState: function(project, instanceId) {
      return {
        providers: stores.ProviderStore.getAll()
      };
    },

    getInitialState: function(){
      return this.getState();
    },

    componentDidMount: function () {
      stores.InstanceStore.addChangeListener(this.updateState);
      stores.ProviderStore.addChangeListener(this.updateState);
      stores.SizeStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.InstanceStore.removeChangeListener(this.updateState);
      stores.ProviderStore.removeChangeListener(this.updateState);
      stores.SizeStore.removeChangeListener(this.updateState);
    },

    updateState: function(){
      if (this.isMounted()) this.setState(this.getState());
    },

    render: function () {
      var instance = this.props.instance,
          project = this.props.project,
          providers = this.state.providers,
          size = stores.SizeStore.get(instance.get('size').id),
          provider = stores.ProviderStore.get(instance.get('provider').id);

      if(!instance || !project || !providers || !size || !provider) return <div className="loading"></div>;

      var breadcrumbs = [
        {
          name: "Resources",
          url: URL.projectResources({project: project})
        },
        {
          name: instance.get('name'),
          url: URL.projectInstance({
            project: project,
            instance: instance
          })
        }
      ];

      //return (
      //  <div>
      //    <BreadcrumbBar breadcrumbs={breadcrumbs}/>
      //    <div className="row resource-details-content">
      //      <div className="col-md-9">
      //        <InstanceInfoSection
      //          instance={instance}
      //          tags={tags}
      //        />
      //        <hr/>
      //        <InstanceDetailsSection
      //          instance={instance}
      //          provider={provider}
      //          size={size}
      //        />
      //        <hr/>
      //      </div>
      //      <div className="col-md-3">
      //        <InstanceActionsAndLinks
      //          project={project}
      //          instance={instance}
      //        />
      //      </div>
      //    </div>
      //  </div>
      //);

      return (
        <div>
          <BreadcrumbBar breadcrumbs={breadcrumbs}/>
          <div className="row resource-details-content">
            <div className="col-md-9">
              <InstanceInfoSection instance={instance}/>
              <hr/>
            </div>
          </div>
        </div>
      );

    }

  });

});
