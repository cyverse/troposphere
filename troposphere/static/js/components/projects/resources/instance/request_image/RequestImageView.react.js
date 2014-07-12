/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/BreadcrumbBar.react',
    'stores/InstanceStore',
    'stores/ProviderStore',
    'stores/SizeStore',
    'stores/IdentityStore',
    'controllers/NotificationController'
  ],
  function (React, Backbone, BreadcrumbBar, InstanceStore, ProviderStore, SizeStore, IdentityStore, NotificationController) {

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
          return (
            <div>
              <BreadcrumbBar/>
              <div className="row resource-details-content">

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
