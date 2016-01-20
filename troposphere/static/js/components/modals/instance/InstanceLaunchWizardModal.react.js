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
        // BasicOptions variables
        //===========================

        // We might have these
        let image = this.props.image ? this.props.image : null;
        let project = this.props.project ? this.props.project : null;
        let view = image ? "BASIC_VIEW" : "IMAGE_VIEW";
        let instanceName = image ? image.attributes.name : null;
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
            image,
            sizes,
            advancedIsDisabled: false,
            LaunchIsDisabled: false,
            advancedLaunch: {
            },
            basicLaunch: {
                instanceName,
                imageVersion: null,
                imageVersionList: null,
                project,
                projectList,
                provider: null,
                providerList: null,
                providerSizeList: null,
                providerSize: null,
                resourcesUsed: null,
                identityProvider: null
            },
            advancedOptions: {
                bootScriptOption: {
                    bootScriptList,
                    attachedScripts: []
                }
            }
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
        if (this.isMounted()) {
            
            let instanceName = null;
            let projectList = this.state.basicLaunch.projectList ?
                this.state.basicLaunch.projectList :
                stores.ProjectStore.getAll();

            let project = this.state.basicLaunch.project ?
                this.state.basicLaunch.project :
                null;

            if (projectList && !project) {
                project = this.state.basicLaunch.project ?
                    this.state.basicLaunch.project :
                    projectList.first();
            }

            let bootScriptList = stores.ScriptStore.getAll();

            // Base Image Version List is dependent on the Base Image
            var imageVersionList = null;
            var imageVersion = this.state.basicLaunch.imageVersion ?
                this.state.imageVersion : null;

            // providerList dependent on imageVersion
            let providerList = this.state.basicLaunch.providerList ?
                this.state.basicLaunch.providerList :
                null;

            var provider = this.state.basicLaunch.provider ?
                this.state.basicLaunch.provider:
                null;

            // Provider Sizes list is dependent on the provider
            var providerSizeList = null;

            var providerSize =  null;
            var resourcesUsed = this.state.basicLaunch.resourcesUsed ?
                this.state.basicLaunch.resourcesUsed : null;
            var identityProvider = this.state.basicLaunch.identityProvider ?
                this.state.basicLaunch.identityProvider : null;


            if (this.state.image) {
                
                instanceName = this.state.instanceName ? 
                    this.state.instanceName :
                    this.state.image.attributes.name;
                imageVersionList = this.state.basicLaunch.imageVersionList ?
                    this.state.basicLaunch.imageVersionList :
                    stores.ImageVersionStore.fetchWhere({image_id: this.state.image.id});

                //imageVersion is dependent on imageVersionList
                if (imageVersionList) {
                    imageVersion = this.state.basicLaunch.imageVersion ?
                        this.state.basicLaunch.imageVersion :
                        imageVersionList.last();

                    // providerList and provider are dependent on imageVersion
                    if (imageVersion) {
                        providerList = this.state.basicLaunch.providerList ?
                            this.state.basicLaunch.providerList :
                            new Backbone.Collection(imageVersion.get('machines').map((item) => item.provider));
                        provider = this.state.basicLaunch.provider ?
                            this.state.basicLaunch.provider :
                            providerList.first();
                    }
                };
            }


            if (provider) {
                resourcesUsed = this.state.basicLaunch.resourcesUsed ?
                    this.state.basicLaunch.resourcesUsed :
                    stores.InstanceStore.getTotalResources(provider.id);

                identityProvider = stores.IdentityStore.findOne({
                        'provider.id': provider.id
                });

                providerSizeList = stores.SizeStore.fetchWhere({
                    provider__id: provider.id
                });

                if (providerSizeList) {
                    providerSize = this.state.basicLaunch.providerSize ?
                        this.state.basicLaunch.providerSize :
                        providerSizeList.first();
                };
            }

            this.setState({
                basicLaunch: _.defaults({
                    identityProvider,
                    providerSizeList,
                    providerSize,
                    imageVersionList,
                    imageVersion,
                    resourcesUsed,
                    providerList,
                    provider,
                    projectList,
                    project,
                }, this.state.basicLaunch),

                advancedOptions: {
                    bootScriptOption: {
                        ...this.state.advancedOptions.bootScriptOption,
                        bootScriptList: bootScriptList 
                    }
                }
            });
        }
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
        this.replaceState(this.getInitialState());
    },

    viewBasic: function() {
        this.setState({
            view: 'BASIC_VIEW',
        });
    },

    viewAdvanced: function() {
        this.setState({
            view:'ADVANCED_VIEW',
        });
    },

    //===================================
    // Image Select Step Event Handler
    //===================================

    // When user selects an image
    // Sets the image the instance is based on.
    // Sets the versions list and default version dependent on the image being selected
    onSelectImage: function(image) {
        let instanceName = image.attributes.name;
        let imageVersionList = stores.ImageVersionStore.fetchWhere({image_id: image.id});
        let imageVersion = null;
        let providerList = null;
        let provider = null;
        let providerSizeList = null;
        let providerSize = null;
        let identityProvider = null;
        let resourcesUsed = null;

        if (imageVersionList) {
            imageVersion = imageVersionList.last();
            if (imageVersion) {
                providerList = new Backbone.Collection(imageVersion.get('machines').map((item) => item.provider));
                provider = providerList.first();
                resourcesUsed = stores.InstanceStore.getTotalResources(provider.id);
                providerSizeList = stores.SizeStore
                    .fetchWhere({
                        provider__id: provider.id
                    });

                identityProvider = stores.IdentityStore.findOne({
                        'provider.id': provider.id
                });
                if (providerSizeList) {
                    providerSize = providerSizeList.first();
                };
            }

        }

        this.setState({
            view:'BASIC_VIEW',
            image: image,
            basicLaunch:
                _.defaults({
                    instanceName,
                    imageVersionList,
                    imageVersion,
                    providerList,
                    provider,
                    resourcesUsed,
                    providerSizeList,
                    providerSize,
                    identityProvider
                }, this.state.basicLaunch)
        });
    },

    //===================================
    // Basic Options Event Handlers
    //===================================

    onBack: function() {
        this.viewImageSelect();
    },

    onNameChange: function(name) {
        this.setState({
            basicLaunch: _.defaults({
                name
            }, this.state.basicLaunch)
        });
    },

    onVersionChange: function(version) {
        this.setState({
            basicLaunch: _.defaults({
                imageVersion: version
            }, this.state.basicLaunch)
        });
    },

    onProjectChange: function(project) {
        this.setState({
            basicLaunch: _.defaults({
                project: project
            }, this.state.basicLaunch)
        });
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
            basicLaunch: _.defaults({
                provider,
                providerSizeList,
                providerSize,
                identityProvider,
                resourcesUsed
            }, this.state.basicLaunch)
        });
    },

    onSizeChange: function(size) {

        this.setState({
            basicLaunch: _.defaults({
                providerSize: size
            }, this.state.basicLaunch)
        });
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
        let basic = this.state.basicLaunch;
        let scripts = this.state.advancedOptions
            .bootScriptOption.attachedScripts;

        let launchData = {
            project: basic.project,
            instanceName: basic.instanceName,
            identity: basic.identityProvider,
            size: basic.providerSize,
            version: basic.imageVersion,
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

        return (
            <BasicLaunchStep {...this.state.basicLaunch}
                advancedIsDisabled={this.state.advancedIsDisabled}
                launchIsDisabled={this.state.launchIsDisabled}
                image={this.state.image}
                onNameChange={this.onNameChange}
                onVersionChange={this.onVersionChange}
                onProjectChange={this.onProjectChange}
                onProviderChange={this.onProviderChange}
                onSizeChange={this.onSizeChange}
                onRequestResources={this.onRequestResources}
                viewAdvanced={this.viewAdvanced}
                onCancel={this.onCancelModal}
                onSubmitLaunch={this.onSubmitLaunch}
                onBack={this.onBack}
            />
        );
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
