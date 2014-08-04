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
    'url'
  ],
  function (React, Backbone, BreadcrumbBar, ReportInstanceIntroduction, ReportInstanceForm, InstanceStore, SizeStore, URL) {

    function getState(project, instanceId) {
      return {
        instance: InstanceStore.getInstanceInProject(project, instanceId)
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
        SizeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        InstanceStore.removeChangeListener(this.updateState);
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
              name: "Report Instance"
            }
          ];

          return (
            <div>
              <BreadcrumbBar breadcrumbs={breadcrumbs}/>
              <div className="row report-instance-view">
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
