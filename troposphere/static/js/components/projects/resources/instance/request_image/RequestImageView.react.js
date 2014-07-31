/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/BreadcrumbBar.react',
    './RequestImageForm.react',
    'stores/InstanceStore',
    'stores/ProviderStore',
    'stores/SizeStore',
    'stores/TagStore',
    'controllers/NotificationController',
    'url'
  ],
  function (React, Backbone, BreadcrumbBar, RequestImageForm, InstanceStore, ProviderStore, SizeStore, TagStore, NotificationController, URL) {

    function getState(project, instanceId) {
      return {
        instance: InstanceStore.get(instanceId),
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
          var providerId = this.state.instance.get('identity').provider;
          var provider = this.state.providers.get(providerId);

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
            },
            {
              name: "Request Image"
            }
          ];

          return (
            <div>
              <BreadcrumbBar breadcrumbs={breadcrumbs}/>
              <div className="row resource-details-content">
                <RequestImageForm instance={this.state.instance}
                                  provider={provider}
                                  tags={this.state.tags}
                />
              </div>
            </div>
          );
        }

        return (
           <div className="loading"></div>
        );
      }

    });

  });
