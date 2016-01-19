import React from 'react';
import Backbone from 'backbone';
import _ from 'underscore';
import stores from 'stores';
import BasicInfoForm from '../components/BasicInfoForm.react';
import ResourcesForm from '../components/ResourcesForm.react';
import InstanceLaunchFooter from '../components/InstanceLaunchFooter.react';

export default React.createClass({

    render: function () {
        return (
            <div>
                <div className="modal-section row">
                    <div className="col-md-6">
                        <h3 className="t-title">Basic Info</h3>
                        <hr/>
                        <BasicInfoForm
                            image={this.props.image}
                            project={this.props.project}
                            projects={this.props.projects}
                            imageVersions={this.props.imageVersions}
                            imageVersion={this.props.imageVersion}
                            onNameChange={this.props.onNameChange}
                            onVersionChange={this.props.onVersionChange}
                            onProjectChange={this.props.onProjectChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <h3 className="t-title">Resources</h3>
                        <hr/>
                        <ResourcesForm
                            providers={this.props.providers}
                            provider={this.props.provider}
                            providerSizes={this.props.providerSizes}
                            providerSize={this.props.providerSize}
                            resourcesUsed={this.props.resourcesUsed}
                            identityProvider={this.props.identityProvider}
                            onProviderChange={this.props.onProviderChange}
                            onSizeChange={this.props.onSizeChange}
                            onRequestResources={this.props.onRequestResources}
                        />
                </div>
                </div>
                <InstanceLaunchFooter
                    onBack={this.props.onBack}
                    onCancel={this.props.onCancel}
                    onSubmitLaunch={this.props.onSubmitLaunch}
                    viewAdvanced={this.props.viewAdvanced}
                    launchIsDisabled={this.props.launchIsDisabled}
                    advancedIsDisabled={this.props.launchIsDisabled}
                    backIsDisabled={false}
                />

            </div>
        );
    }
});
