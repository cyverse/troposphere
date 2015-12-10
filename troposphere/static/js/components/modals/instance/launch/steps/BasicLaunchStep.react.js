import React from 'react';
import Backbone from 'backbone';
import _ from 'underscore';
import stores from 'stores';
import BasicInfoForm from '../components/BasicInfoForm.react';
import ResourcesForm from '../components/ResourcesForm.react';

export default React.createClass({

    getInitialState: function () {
        return this.getState();
    },

    getState: function () {
        let providers = stores.ProviderStore.getAll() || null;
        let projects = stores.ProjectStore.getAll() || null;
        let imageId = this.props.image.get('id');
        let imageVersions = stores.ImageVersionStore.fetchWhere({image_id: imageId}) || null;

        return {
            providers: providers,
            projects: projects,
            imageVersions: imageVersions
        }
    },

    updateState: function () {
        if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function () {
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.ImageVersionStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
        stores.ImageVersionStore.removeChangeListener(this.updateState);
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.ProjectStore.removeChangeListener(this.updateState);
    },
    render: function () {
        if (this.state.providers == null) {
            return (
                <div className="loading"/>
            );
        }

        let projects = this.state.projects;
        let providers = this.state.providers;
        // Need to determine default provier
        let defaultProvider = providers.first();
        let defaultProject = this.props.project;
        let baseImage = this.props.image;
        let imageId = baseImage.attributes.id;
        let imageVersions = this.state.imageVersions;

        return (
            <div>
                <div className="modal-section row">
                    <div className="col-md-6">
                        <h3 className="title">Basic Info</h3>
                        <hr/>
                        <BasicInfoForm
                            imageBase={baseImage}
                            defaultProject={defaultProject}
                            projects={projects}
                            imageVersions={imageVersions}/>
                    </div>
                    <div className="col-md-6">
                        <h3 className="title">Resources</h3>
                        <hr/>
                        <ResourcesForm
                            providers={providers}
                            provider={defaultProvider}
                            identity={this.props.identity}/>
                    </div>

                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary pull-right">
                        Launch Instance
                    </button>
                    <button type="button" className="btn btn-default pull-right" onClick={this.props.cancel}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
});
