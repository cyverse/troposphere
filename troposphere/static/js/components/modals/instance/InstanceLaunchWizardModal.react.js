// Dev Dependencies
import React from 'react/addons';
import Backbone from 'backbone';
import _ from 'underscore';
import modals from 'modals';
import stores from 'stores';
import actions from 'actions';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';

// Components
import ImageSelectStep from './launch/steps/ImageSelectStep.react';
import BasicLaunchStep from './launch/steps/BasicLaunchStep.react';
import AdvancedLaunchStep from './launch/steps/AdvancedLaunchStep.react';

export default React.createClass({
    mixins: [BootstrapModalMixin],
    displayName: "InstanceLaunchWizardModal",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model),
        project: React.PropTypes.instanceOf(Backbone.Model),
        onConfirm: React.PropTypes.func.isRequired,
    },

    getInitialState: function() {

        //===========================
        // We might have these
        let image = this.props.image ? this.props.image : null;
        let project = this.props.project ? this.props.project : null;
        let provider = null;
        let view = image ? "BASIC_VIEW" : "IMAGE_VIEW";
        let imageName = image ? image.get("name") : null;
        // These need to populate
        let projectList = stores.ProjectStore.getAll() || null;
        let sizes = stores.SizeStore.getAll() || null;
        let identities = stores.IdentityStore.getAll() || null;

        //===========================
        // AdvanceSettings variables
        //===========================

        // These need to populate
        let bootScriptList = stores.ScriptStore.getAll();

        return {
            view,
            provider,
            image,
            sizes,
            advancedIsDisabled: false,
            LaunchIsDisabled: false,
            advancedLaunch: {},

            // Launch data
            instanceName: null, // NOTE: this is only set when a user types in a specific name
            imageVersion: null,
            project,
            providerSize: null,
            identityProvider: null,
            scripts: null,

            // Advanced options
            bootScriptList,
            attachedScripts: [],
        }
    },

    //
    // UpdateState
    // ----------------------
    // UpdateState gets called from our channge listeners when Models are populated or changed.
    // Conditional values are because some of these properties are defaults that can be changed by the user.
    // If statments are because these queries are dependent of other models that must be populated first.
    //

    updateState: function() {
        var imageVersionList;
        if (this.state.image) {
            imageVersionList = stores.ImageVersionStore.fetchWhere({image_id: this.state.image.id});
        }

        var imageVersion;
        if (imageVersionList) {
            imageVersion = this.state.imageVersion ?
                this.state.imageVersion :
                imageVersionList.last();
        }

        var providerList, provider;
        if (imageVersion) {
            providerList = this.state.providerList ?
                this.state.providerList :
                new Backbone.Collection(imageVersion.get('machines').map((item) => item.provider));
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

        // NOTE: Only update state for things that need defaults
        this.setState({ 
            imageVersion, 
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
    },

    componentWillUnmount: function() {
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.ImageVersionStore.removeChangeListener(this.updateState);
        stores.ScriptStore.removeChangeListener(this.updateState);
    },

    //===================================
    // Internal Modal Callbacks
    //===================================

    getState: function() {
        return this.state;
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

    //===================================
    // Image Select Step Event Handler
    //===================================

    // When user selects an image
    // Sets the image the instance is based on.
    // Sets the versions list and default version dependent on the image being selected
    onSelectImage: function(image) {
        // TODO: throw error if image undefined?
        var imageName = image.get("name");

        // NOTE: the vars/lets can be used for different purposes
        var imageVersion, providerSize, identityProvider;

        let imageVersionList = stores.ImageVersionStore.fetchWhere({image_id: image.id});
        if (imageVersionList) {
            imageVersion = imageVersionList.last();
        }

        // NOTE: this empty variable shows that the intention of the next
        // block is to set its value (it's also necessary in this case)
        let providerSizeList;
        if (imageVersion) {
            let providerList = new Backbone.Collection(imageVersion.get('machines').map((item) => item.provider));
            let provider = providerList.first();
//                let resourcesUsed = stores.InstanceStore.getTotalResources(provider.id);    // TODO: FIND OUT WHY THIS IS HERE
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
            imageName,
            providerSize,
            identityProvider,
        }, this.viewBasic);
    },

    //===================================
    // Basic Options Event Handlers
    //===================================

    onBack: function() {
        this.viewImageSelect();
    },

    onNameChange: function(name) {
        this.setState({ instanceName: name });
    },

    onVersionChange: function(version) {
        this.setState({ imageVersion: version });
    },

    onProjectChange: function(project) {
        this.setState({ project: project });
    },

    onProviderChange: function(provider) {
        let providerSizeList = stores.SizeStore
            .fetchWhere({
                provider__id: provider.id
            });
        let providerSize = providerSizeList ?
            providerSizeList.first() : null;
        let identityProvider = stores.IdentityStore
            .findOne({
                'provider.id': provider.id
            });
        let resourcesUsed = stores.InstanceStore
            .getTotalResources(provider.id);

        this.setState({
            provider,
            providerSizeList,
            providerSize,
            identityProvider,
            resourcesUsed
        });
    },

    onSizeChange: function(size) {
        this.setState({ providerSize: size });
    },

    onRequestResources: function() {

        // Launching a resource request modal will eat the current modal. We need to pass this. onCancelModal as a prop
        // in order to properly unmount the whole modal, not just the current step component.
        this.onCancelModal();
        modals.HelpModals.requestMoreResources();
    },

    //==================================
    // Advanced Option Event Handlers
    //=================================
    
    onAddAttachedScript: function(value) {
        let bootScriptOption = this.state.advancedOptions.bootScriptOption;
        let attachedScripts = bootScriptOption.attachedScripts;

        this.setState({
            advancedOptions: {
                bootScriptOption: _.defaults({
                    attachedScripts: [...attachedScripts, value]
                }, bootScriptOption)
            }
        })
    },

    onRemoveAttachedScript: function(item) {
        let bootScriptOption = this.state.advancedOptions.bootScriptOption;
        let attachedScripts = bootScriptOption.attachedScripts
            .filter((i) => i != item);

        this.setState({
            advancedOptions: {
                bootScriptOption: _.defaults({
                    attachedScripts
                }, bootScriptOption)
            }
        });
    },

    //==============================================
    // Instance Luanch Modal Master Event Handlers
    //==============================================

    onCancelModal: function() {
        this.hide();
    },
    
    onSaveAdvanced: function() {
        this.viewBasic()
    },

    onCancelAdvanced: function() {
        let advancedOptions = this.state.advancedOptions;
        let bootScriptOption = advancedOptions.bootScriptOption;

        this.setState({
            advancedOptions: {
                ...advancedOptions,
                bootScriptOption: {
                    ...bootScriptOption,
                    attachedScripts: []
                }
            }
        });

        this.viewBasic();
    },

    onSubmitLaunch: function() {
        let scripts = this.state.advancedOptions
            .bootScriptOption.attachedScripts;

        // TODO: this object is the real state for this component (it's what's
        // necessary) this entire method should be simplified to the following:
        //
        // actions.InstanceActions.launch(this.state);
        // this.hide();

        let launchData = {
            project: this.state.project,
            instanceName: this.state.instanceName || this.state.imageName,
            identity: this.state.identityProvider,
            size: this.state.providerSize,
            version: this.state.imageVersion,
            scripts: scripts
        };

        actions.InstanceActions.launch(launchData);

        this.hide();
    },

//=========================================
// Render Methods
//=========================================

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
                onCancel = {this.onCancelModal}
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

        return React.createElement(BasicLaunchStep, _.extend({}, this.state, {
            projectList,
            providerList,
            providerSizeList,
            resourcesUsed,
            imageVersionList,
            onNameChange: this.onNameChange,
            onVersionChange: this.onVersionChange,
            onProjectChange: this.onProjectChange,
            onProviderChange: this.onProviderChange,
            onSizeChange: this.onSizeChange,
            onRequestResources: this.onRequestResources,
            viewAdvanced: this.viewAdvanced,
            onCancel: this.onCancelModal,
            onSubmitLaunch: this.onSubmitLaunch,
            onBack: this.onBack,
        }));
    },

    renderAdvancedOptions: function() {

        return (
            <AdvancedLaunchStep {...this.state.advancedOptions}
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
