import React from 'react/addons';
import Backbone from 'backbone';
import _ from 'underscore';
import modals from 'modals';
import stores from 'stores';
import actions from 'actions';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';

import ImageSelectStep from './launch/steps/ImageSelectStep.react';
import BasicLaunchStep from './launch/steps/BasicLaunchStep.react';
import AdvancedLaunchStep from './launch/steps/AdvancedLaunchStep.react';

// This class implements the instance launch walkthrough. By design it keeps
// track of two states. First is the state for switching between separate
// views of the modal. The second is the state for launching an actual
// instance, i.e. the state requisite for the launch api call (see
// onSubmitLaunch). Do not add state friviously. This component operates by
// defining all the operations to update its state as functions which it
// passes to the appropriate children.
export default React.createClass({
    mixins: [BootstrapModalMixin],
    displayName: "InstanceLaunchWizardModal",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model),
        project: React.PropTypes.instanceOf(Backbone.Model),
        onConfirm: React.PropTypes.func.isRequired,
        initialView: React.PropTypes.string.isRequired,
    },

    getInitialState: function() {

        // We might have these
        let image = this.props.image ? this.props.image : null;
        let imageName = image ? image.get("name") : null;
        let project = this.props.project ? this.props.project : null;
        let view = this.props.initialView;

        return {
            // State for general operation (switching views, etc) 
            view,
            image,
            provider: null,

            // State for launch
            instanceName: null, // NOTE: this is only set when a user types in a specific name
            imageVersion: null,
            project,
            providerSize: null,
            identityProvider: null,
            attachedScripts: [],
        }
    },

    // Set the components state based on cloud defaults. 
    //
    // Whenever the wizard mounts it listens for changes from the stores,
    // passing this function as a callback. Incrementally it calls stores to
    // fetch data. It only sets state for defaults, i.e if project is null,
    // set the project to the first returned from the cloud. It primes our
    // stores, so that render can just call get and eventually get data.
    updateState: function() {
        var project = this.state.project;
        if (!project) {
            project = stores.ProjectStore.getAll().first();
        }

        var imageVersionList;
        if (this.state.image) {
            imageVersionList = stores.ImageVersionStore.fetchWhere({image_id: this.state.image.id});
        }

        var imageVersion = this.state.imageVersion;
        if (imageVersionList && !imageVersion) {
            imageVersion = imageVersionList.last();
        }

        var providerList, provider;
        if (imageVersion) {
            providerList = new Backbone.Collection(imageVersion.get('machines').map((item) => item.provider));
            provider = this.state.provider ?
                this.state.provider :
                providerList.first();
        }

        var resourcesUsed, identityProvider, providerSizeList, providerSize;
        if (provider) {
            resourcesUsed = stores.InstanceStore.getTotalResources(provider.id);

            identityProvider = this.state.identityProvider
                ? this.state.identityProvider
                : stores.IdentityStore.findOne({
                    'provider.id': provider.id
                  });

            providerSizeList = stores.SizeStore.fetchWhere({
                provider__id: provider.id
            });

            if (providerSizeList) {
                providerSize = this.state.providerSize ?
                    this.state.providerSize :
                    providerSizeList.first();
            };
        }

        // NOTE: Only update state for things that need defaults. Data fetched
        // from the cloud is not part of the component's state that it
        // manages.
        this.setState({ 
            imageVersion, 
            project,
            provider, 
            providerSize, 
            identityProvider, 
        });
    },

    componentDidMount: function() {
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.ImageVersionStore.addChangeListener(this.updateState);
        stores.ScriptStore.addChangeListener(this.updateState);

        // NOTE: This is not nice. This enforces that every time a component
        // mounts updateState gets called. Otherwise, if a component mounts
        // after data has been fetched, then updateState never gets called. 
        this.updateState();
    },

    componentWillUnmount: function() {
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.ImageVersionStore.removeChangeListener(this.updateState);
        stores.ScriptStore.removeChangeListener(this.updateState);
    },

    viewImageSelect: function() {
        this.setState({ view: "IMAGE_VIEW", });
    },

    viewBasic: function() {
        this.setState({ view: 'BASIC_VIEW', });
    },

    viewAdvanced: function() {
        this.setState({ view:'ADVANCED_VIEW', });
    },

    onSelectImage: function(image) {
        var imageVersion, providerSize, identityProvider;

        let imageVersionList = stores.ImageVersionStore.fetchWhere({image_id: image.id});
        if (imageVersionList) {
            imageVersion = imageVersionList.last();
        }

        let providerSizeList;
        if (imageVersion) {
            let providerList = new Backbone.Collection(imageVersion.get('machines').map((item) => item.provider));
            let provider = providerList.first();
            providerSizeList = stores.SizeStore .fetchWhere({
                provider__id: provider.id
            });

            identityProvider = stores.IdentityStore.findOne({
                    'provider.id': provider.id
            });
        }

        if (providerSizeList) {
            providerSize = providerSizeList.first();
        };

        this.setState({
            image,
            imageVersion,
            providerSize,
            providerSize,
            identityProvider,
        }, this.viewBasic);
    },

    onBack: function() {
        this.viewImageSelect();
    },

    onNameChange: function(instanceName) {
        this.setState({ instanceName });
    },

    onVersionChange: function(imageVersion) {
        this.setState({ imageVersion });
    },

    onProjectChange: function(project) {
        this.setState({ project });
    },

    onProviderChange: function(provider) {
        this.setState({ provider });
    },

    onSizeChange: function(providerSize) {
        this.setState({ providerSize });
    },

    onRequestResources: function() {
        this.hide();
        modals.HelpModals.requestMoreResources();
    },

    onAddAttachedScript: function(value) {
        let attachedScripts = this.state.attachedScripts;

        this.setState({ attachedScripts: [...attachedScripts, value] });
    },

    onRemoveAttachedScript: function(item) {
        let attachedScripts = this.state.attachedScripts
            .filter((i) => i != item);

        this.setState({ attachedScripts });
    },

    onSaveAdvanced: function() {
        this.viewBasic()
    },

    onCancelAdvanced: function() {
        this.setState({ attachedScripts: [] });
        this.viewBasic();
    },

    onSubmitLaunch: function() {
        let scripts = this.state.attachedScripts;

        let launchData = {
            project: this.state.project,
            instanceName: this.state.instanceName || this.image.get("name"),
            identity: this.state.identityProvider,
            size: this.state.providerSize,
            version: this.state.imageVersion,
            scripts: scripts
        };

        actions.InstanceActions.launch(launchData);
        this.hide();
    },

    renderBody: function() {
        var view = this.state.view;
        switch(view) {
            case "IMAGE_VIEW":
            return this.renderImageSelect()
            case "BASIC_VIEW":
            return this.renderBasicOptions()
            case "ADVANCED_VIEW":
            return this.renderAdvancedOptions()
        }
    },

    renderImageSelect: function() {

        return (
            <ImageSelectStep
                image={this.state.image}
                onSelectImage={this.onSelectImage}
                onCancel = {this.hide}
            />
        );
    },

    renderBasicOptions: function() {
        let provider = this.state.provider;
        let imageVersion = this.state.imageVersion;
        let projectList = stores.ProjectStore.getAll() || null;
        let sizes = stores.SizeStore.getAll() || null;
        let identities = stores.IdentityStore.getAll() || null;
        let bootScriptList = stores.ScriptStore.getAll();

        var project = this.state.project;
        if (!project && projectList) {
            project = projectList.first();
        }

        var imageVersionList;
        if (this.state.image) {
            imageVersionList = stores.ImageVersionStore.fetchWhere({image_id: this.state.image.id});
        }

        var providerList, providerSizeList, resourcesUsed; 
        if (provider && imageVersion) {
            providerList = new Backbone.Collection(imageVersion.get('machines').map((item) => item.provider));
            providerSizeList = stores.SizeStore.fetchWhere({
                provider__id: provider.id
            });
            resourcesUsed = stores.InstanceStore.getTotalResources(provider.id);
        }

        return <BasicLaunchStep { ...{
            sizes,
            projectList,
            providerList,
            providerSizeList,
            resourcesUsed,
            imageVersionList,
            backIsDisabled: this.props.initialView == "BASIC_VIEW",
            onNameChange: this.onNameChange,
            onVersionChange: this.onVersionChange,
            onProjectChange: this.onProjectChange,
            onProviderChange: this.onProviderChange,
            onSizeChange: this.onSizeChange,
            onRequestResources: this.onRequestResources,
            viewAdvanced: this.viewAdvanced,
            onCancel: this.hide,
            onSubmitLaunch: this.onSubmitLaunch,
            onBack: this.onBack,
        }} />
    },

    renderAdvancedOptions: function() {
        let bootScriptList = stores.ScriptStore.getAll();
        return (
            <AdvancedLaunchStep 
                bootScriptList={bootScriptList}
                attachedScripts={this.state.attachedScripts}
                onAddAttachedScript={this.onAddAttachedScript}
                onRemoveAttachedScript={this.onRemoveAttachedScript}
                cancelAdvanced={this.onCancelAdvanced}
                onSaveAdvanced={this.onSaveAdvanced}
            />
        );
    },
    
    headerTitle: function() {
        var view = this.state.view;
        switch(view) {
            case "IMAGE_VIEW":
            return "Select an Image"
            case "BASIC_VIEW":
            return "Basic Options"
            case "ADVANCED_VIEW":
            return "Advanced Options"
        }
    },

    render: function() {

        return (
            <div className="modal fade">
                <div className="modal-dialog" style={{width:"100%", maxWidth:"800px"}}>
                    <div className="modal-content">
                        <div className="modal-header instance-launch">
                            {this.renderCloseButton()}
                            <h2 className="headline">Launch an Instance / {this.headerTitle()}</h2>
                        </div>
                        <div className="modal-body">
                            {this.renderBody()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
