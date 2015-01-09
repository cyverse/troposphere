/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './ProviderList.react',
    './ProviderName.react',
    './ProviderStats.react',
    './ProviderDescription.react',
    './ProviderInstances.react',
    './ProviderResourcesSection.react'
  ],
  function (React, Backbone, ProviderList, ProviderName, ProviderStats, ProviderDescription, ProviderInstances, ProviderResourcesSection) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection)
      },

      getInitialState: function(){
        return {
          currentProvider: this.props.providers.first()
        }
      },

      handleProviderChange: function(provider){
        this.setState({currentProvider: provider});
      },

      render: function () {
        var provider = this.state.currentProvider,
            identities = this.props.identities,
            instances = this.props.instances,
            volumes = this.props.volumes,
            projects = this.props.projects;

        return (
          <div>
            <div className="container">
              <div className="col-md-2">
                <ProviderList providers={this.props.providers}
                              selectedProvider={provider}
                              onSelectedProviderChanged={this.handleProviderChange}
                />
              </div>
              <div className="col-md-10 provider-details">
                <ProviderName provider={provider}/>
                <ProviderStats provider={provider}
                               identities={identities}
                               instances={instances}
                />
                <ProviderDescription provider={provider}/>
                <ProviderInstances provider={provider}
                                   identities={identities}
                                   instances={instances}
                                   volumes={volumes}
                                   projects={projects}
                />
                <ProviderResourcesSection provider={provider}
                                          identities={identities}
                                          instances={instances}
                                          volumes={volumes}
                                          projects={projects}
                />
              </div>
            </div>
          </div>
        );

      }

    });

  });
