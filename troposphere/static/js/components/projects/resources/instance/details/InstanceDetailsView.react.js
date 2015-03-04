/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/BreadcrumbBar.react',
    './sections/InstanceInfoSection.react',
    './sections/InstanceDetailsSection.react',
    './actions/InstanceActionsAndLinks.react',
    'controllers/NotificationController',
    'url',
    'stores'
  ],
  function (React, Backbone, BreadcrumbBar, InstanceInfoSection, InstanceDetailsSection, InstanceActionsAndLinks, NotificationController, URL, stores) {

    function getState(project, instanceId) {
      return {
        instance: stores.InstanceStore.get(instanceId),
        providers: stores.ProviderStore.getAll(),
        tags: stores.TagStore.getAll()
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
        stores.InstanceStore.addChangeListener(this.updateState);
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.TagStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
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
          var sizes = stores.SizeStore.getAllFor(providerId, identityId);
          if(sizes) {
            var size = sizes.get(sizeId);

            var breadcrumbs = [
              {
                name: "Resources",
                url: URL.projectResources({project: this.props.project})
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
