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
    'stores/TagStore',
    'controllers/NotificationController',
    'url'
  ],
  function (React, Backbone, BreadcrumbBar, InstanceInfoSection, InstanceDetailsSection, InstanceActionsAndLinks, InstanceStore, ProviderStore, SizeStore, TagStore, NotificationController, URL) {

    function getState(project, instanceId) {
      return {
        instance: InstanceStore.getInstanceInProject(project, instanceId),
        providers: ProviderStore.getAll(),
        tags: TagStore.getAll()
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
        TagStore.addChangeListener(this.updateState);
        SizeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        InstanceStore.removeChangeListener(this.updateState);
        ProviderStore.removeChangeListener(this.updateState);
        TagStore.removeChangeListener(this.updateState);
        SizeStore.removeChangeListener(this.updateState);
      },

      updateState: function(){
        if (this.isMounted()) this.setState(getState(this.props.project, this.props.instanceId));
      },

      render: function () {
        if(this.state.instance && this.state.providers && this.state.tags) {
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
                url: URL.project(this.props.project)
              },
              {
                name: this.state.instance.get('name'),
                url: URL.projectInstance({
                  project: this.props.project,
                  instance: this.state.instance
                })
              }
            ];

            return (
              <div>
                <BreadcrumbBar breadcrumbs={breadcrumbs}/>
                <div className="row resource-details-content">
                  <div className="col-md-9">
                    <InstanceInfoSection instance={this.state.instance}
                                         tags={this.state.tags}
                    />
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
