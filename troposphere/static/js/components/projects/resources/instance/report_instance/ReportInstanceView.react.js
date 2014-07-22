/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/BreadcrumbBar.react',
    './ReportInstanceIntroduction.react',
    './ReportInstanceForm.react',
    'stores/InstanceStore',
    'stores/SizeStore',
    'stores/IdentityStore',
    'url'
  ],
  function (React, Backbone, BreadcrumbBar, ReportInstanceIntroduction, ReportInstanceForm, InstanceStore, SizeStore, IdentityStore, URL) {

    function getState(project, instanceId) {
      return {
        instance: InstanceStore.get(instanceId)
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

        // todo: IdentityStore is only included here because InstanceStore.get(instanceId) is
        // lazy loading, but I'm not sure how to get InstanceStore to know when new
        // identities have been without getting this component to call InstanceStore.getAll()
        // again at the moment.  Figure it out and remove this line.
        IdentityStore.addChangeListener(this.updateState);
        SizeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        InstanceStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
        SizeStore.removeChangeListener(this.updateState);
      },

      updateState: function(){
        if (this.isMounted()) this.setState(getState(this.props.project, this.props.instanceId));
      },

      render: function () {
        if(this.state.instance) {
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
            },
            {
              name: "Report Instance"
            }
          ];

          return (
            <div>
              <BreadcrumbBar breadcrumbs={breadcrumbs}/>
              <div className="row resource-details-content">
                <div className="col-md-12">
                  <ReportInstanceIntroduction instance={this.state.instance}/>
                  <ReportInstanceForm instance={this.state.instance}/>
                </div>
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
