/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/BreadcrumbBar.react',
    './sections/InstanceInfoSection.react',
    './sections/InstanceDetailsSection.react',
    './actions/InstanceActionsAndLinks.react',
    'stores/InstanceStore',
    'stores/ProviderStore',
    'stores/SizeStore',
    'stores/IdentityStore',
    'controllers/NotificationController',
    'url'
  ],
  function (React, Backbone, BreadcrumbBar, InstanceInfoSection, InstanceDetailsSection, InstanceActionsAndLinks, InstanceStore, ProviderStore, SizeStore, IdentityStore, NotificationController, URL) {

    function getState(project, instanceId) {
      return {
        instance: InstanceStore.get(instanceId),
        providers: ProviderStore.getAll()
      };
    }

    return React.createClass({

      propTypes: {
        instanceId: React.PropTypes.string.isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function(){
        return getState(this.props.project, this.props.instanceId);
      },

      componentDidMount: function () {
        InstanceStore.addChangeListener(this.updateState);
        ProviderStore.addChangeListener(this.updateState);

        // todo: IdentityStore is only included here because InstanceStore.get(instanceId) is
        // lazy loading, but I'm not sure how to get InstanceStore to know when new
        // identities have been without getting this component to call InstanceStore.getAll()
        // again at the moment.  Figure it out and remove this line.
        IdentityStore.addChangeListener(this.updateState);
        SizeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        InstanceStore.removeChangeListener(this.updateState);
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
        SizeStore.removeChangeListener(this.updateState);
      },

      updateState: function(){
        if (this.isMounted()) this.setState(getState(this.props.project, this.props.instanceId));
      },

      render: function () {
        if(this.state.instance && this.state.providers) {
          //var instance = this.state.instances.get(this.props.instanceId);
          //if(!instance) NotificationController.error(null, "No instance with id: " + this.props.volumeId);

          var providerId = this.state.instance.get('identity').provider;
          var provider = this.state.providers.get(providerId);

          var identityId = this.state.instance.get('identity').id;
          var sizeId = this.state.instance.get('size_alias');
          var sizes = SizeStore.getAllFor(providerId, identityId);
          if(sizes) {
            var size = sizes.get(sizeId);

            var breadcrumbs = [
              {
                name: "Resources",
                url: URL.project(this.props.project, {absolute: true})
              },
              {
                name: this.state.instance.get('name'),
                url: URL.projectInstance({
                  project: this.props.project,
                  instance: this.state.instance
                }, {absolute: true})
              }
            ];

            return (
              <div>
                <BreadcrumbBar breadcrumbs={breadcrumbs}/>
                <div className="row resource-details-content">
                  <div className="col-md-9">
                    <InstanceInfoSection instance={this.state.instance}/>
                    <hr/>
                    <InstanceDetailsSection instance={this.state.instance} provider={provider} size={size}/>
                    <hr/>
                  </div>
                  <div className="col-md-3">
                    <InstanceActionsAndLinks project={this.props.project} instance={this.state.instance}/>
                  </div>
                </div>
              </div>
            );
          }
        }

        return (
           <div className="loading"></div>
        );
      }

    });

  });
