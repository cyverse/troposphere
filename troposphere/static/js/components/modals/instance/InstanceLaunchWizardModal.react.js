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

// TODO: test if I need to get this here anymore.
let imageVersions = stores.ImageVersionStore.getAll();

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

        // We have these
        let image = this.props.image;
        let project = this.props.project;

        // These need to populate
        let projects = stores.ProjectStore || null;
        let providers = stores.ProviderStore.getAll() || null;
        let provider = providers.first() || null;
        let sizes = stores.SizeStore.getAll() || null;
        let resourcesUsed = stores.InstanceStore.getTotalResources(provider.id) || null;
        let identities = stores.IdentityStore.getAll() || null;

        //===========================
        // AdvanceSettings variables
        //===========================

        // These need to populate
        let bootScripts = stores.ScriptStore.getAll();

        return {
            view: "IMAGE_VIEW",
            title: "Select an Image",
            image: image,
            sizes: sizes,
            advancedIsDisabled: false,
            LaunchIsDisabled: false,
            advancedLaunch: {
            },
            basicLaunch: {
                instanceName: null,
                imageVersion: null,
                imageVersions: null,
                project: project,
                projects: projects,
                provider: provider,
                providers: providers,
                providerSizes: null,
                providerSize: null,
                resourcesUsed: resourcesUsed,
                identityProvider: null
            },
            advancedSettings: {
                bootScriptOption: {
                    bootScripts: bootScripts,
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
        debugger;
        if (this.isMounted()) {
            let projects = stores.ProjectStore.getAll();
            let providers= stores.ProviderStore.getAll();
            let identities = stores.IdentityStore;
            let bootScripts = stores.ScriptStore.getAll();

            // Setting defaults conditionally as they will be changed by the user
            let project = this.state.basicLaunch.project
                ? this.state.basicLaunch.project
                : projects.first();

            this.setState({
                basicLaunch: {
                    ...this.state.basicLaunch,
                    projects: projects,
                    providers: providers,
                    project: project,
                },
                advancedSettings: {
                    bootScriptOption: {
                        ...this.state.advancedSettings.bootScriptOption,
                        bootScripts: bootScripts
                    }
                }
            });

            // Here we set the dependent values

            // Base Image Version List is dependent on the Base Image
            if (this.state.image) {
                debugger;
                let imageVersions = stores.ImageVersionStore
                    .fetchWhere({image_id: this.state.image.id});

                this.setState({
                    basicLaunch: {
                        ...this.state.basicLaunch,
                        imageVersions: imageVersions
                    }
                });
            };

            // Image Version is the default value dependent on the Version List
            if (this.state.basicLaunch.imageVersions) {
                debugger;
                let imageVersion = this.state.basicLaunch.imageVersion
                    ? this.state.basicLaunch.imageVersion
                    : this.state.basicLaunch.imageVersions.last();

                this.setState({
                    basicLaunch: {
                        ...this.state.basicLaunch,
                        imageVersion: imageVersion
                    }
                });
            };

            // Provider Sizes list is dependent on the provider
            if (this.state.basicLaunch.provider) {
                let providerSizes = stores.SizeStore
                    .fetchWhere({
                        provider__id: this.state.basicLaunch.provider.get('id')
                    });

                this.setState({
                    basicLaunch: {
                        ...this.state.basicLaunch,
                        providerSizes: providerSizes
                    }
                });
            };

            // Provider size is the default value is dependent on the Provider list
            if (this.state.basicLaunch.providerSizes) {
                let providerSize = this.state.basicLaunch.providerSize
                    ? this.state.basicLaunch.providerSize
                    : this.state.basicLaunch.providerSizes.first();

                this.setState({
                    basicLaunch: {
                        ...this.state.basicLaunch,
                        providerSize: providerSize
                    }
                });
            };

            // Resources are dependent on the Provider
            if (this.state.basicLaunch.provider) {
                let resourcesUsed = stores.InstanceStore
                    .getTotalResources(this.state.basicLaunch.provider.id);

                this.setState({
                    basicLaunch: {
                        ...this.state.basicLaunch,
                        resourcesUsed: resourcesUsed
                    }
                });
            };

            // Identity Provider is dependent on Provider
            if (this.state.basicLaunch.provider && identities) {
                let identityProvider = stores.IdentityStore
                    .findOne({
                        'provider.id': this.state.basicLaunch.provider.get('id')
                    });

                this.setState({
                    basicLaunch: {
                        ...this.state.basicLaunch,
                        identityProvider: identityProvider
                    }
                });
            };
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
            title: 'Basic Options'
        });
    },

    viewAdvanced: function() {
        this.setState({
            view:'ADVANCED_VIEW',
            title: 'Advanced Options'
        });
    },

    //===================================
    // Image Select Step Event Handler
    //===================================

    // When user selects an image
    // Sets the image the instance is based on.
    // Sets the versions list and default version dependent on the image being selected
    selectImage: function(image) {
        let imageName = image.attributes.name;
        let imageId = image.id;
        let imageVersions = stores.ImageVersionStore.fetchWhere({image_id: image.id});

        let imageVersion = null;
        if (imageVersions) {
            imageVersion = imageVersions.last();
            this.setState({
                view:'BASIC_VIEW',
                image: image,
                title: 'Basic Options',
                basicLaunch: {
                    ...this.state.basicLaunch,
                    instanceName: imageName,
                    imageVersions: imageVersions,
                    imageVersion: imageVersion
                }
            });
        }
        else {
            this.setState({
                view:'BASIC_VIEW',
                image: image,
                title: 'Basic Options',
                basicLaunch: {
                    ...this.state.basicLaunch,
                    instanceName: imageName,
                    imageVersions: null,
                    imageVersion: null
                }
            });
            
            this.updateState();
        }

        debugger;
    },

    //===================================
    // Basic Options Event Handlers
    //===================================

    onBack: function() {
        this.viewImageSelect();
    },

    onNameChange: function(name) {
        this.setState({
            basicLaunch: {
                ...this.state.basicLaunch,
                name: name
            }
        });
    },

    onVersionChange: function(version) {
        this.setState({
            basicLaunch: {
                ...this.state.basicLaunch,
                imageVersion: version
            }
        });
    },

    onProjectChange: function(project) {
        this.setState({
            basicLaunch: {
                ...this.state.basicLaunch,
                project: project
            }
        });
    },

    onProviderChange: function(provider) {
        let providerSizes = stores.SizeStore
            .fetchWhere({
                provider__id: provider.id
            });
        let identityProvider = stores.IdentityStore
            .findOne({
                'provider.id': provider.id
            });
        let resourcesUsed = stores.InstanceStore
            .getTotalResources(provider.id);

        this.setState({
            basicLaunch: {
                ...this.state.basicLaunch,
                provider: provider,
                providerSizes: providerSizes,
                identityProvider: identityProvider,
                resourcesUsed: resourcesUsed
            }
        });
    },

    onSizeChange: function(size) {
        this.setState({
            basicLaunch: {
                ...this.state.basicLaunch,
                providerSize: size
            }
        });
    },

    onRequestResources: function() {
        // Launching a resource request modal will eat the current modal. We need to pass this.cancel as a prop
        // in order to properly unmount the whole modal, not just the current step component.
        console.log('requested');
        this.cancel();
        modals.HelpModals.requestMoreResources();
    },

    //==================================
    // Advanced Option Event Handlers
    //=================================
    
    onAddAttachedScript: function(value) {
        let bootScriptOption = this.state.advancedSettings.bootScriptOption;
        let attachedScripts = bootScriptOption.attachedScripts;

        this.setState({
            advancedSettings: {
                bootScriptOption: {
                    ...bootScriptOption,
                    attachedScripts: [...attachedScripts, value]
                }
            }
        })
    },

    onRemoveAttachedScript: function(item) {
        let bootScriptOption = this.state.advancedSettings.bootScriptOption;
        let attachedScripts = bootScriptOption.attachedScripts
            .filter((i) => i != item);

        this.setState({
            advancedSettings: {
                bootScriptOption: {
                    ...bootScriptOption,
                    attachedScripts
                }
            }
        });
    },

    //==============================================
    // Instance Luanch Modal Master Event Handlers
    //==============================================

    cancel: function() {
        this.hide();
    },
    
    onSaveAdvanced: function() {
        this.viewBasic()
    },

    onCancelAdvanced: function() {
        let advancedSettings = this.state.advancedSettings;
        let bootScriptOption = advancedSettings.bootScriptOption;
        this.setState({
            advancedSettings: {
                ...advancedSettings,
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
        let scripts = this.state.advancedSettings
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
                selectImage={this.selectImage}
                cancel = {this.cancel}
            />
        );
    },

    renderBasicOptions: function() {
        return (
            <BasicLaunchStep {...this.state.basicLaunch}
                image={this.state.image}
                onNameChange={this.onNameChange}
                onVersionChange={this.onVersionChange}
                onProjectChange={this.onProjectChange}
                onProviderChange={this.onProviderChange}
                onSizeChange={this.onSizeChange}
                onRequestResources={this.onRequestResources}
                viewAdvanced={this.viewAdvanced}
                cancel={this.cancel}
                onSubmitLaunch={this.onSubmitLaunch}
                advancedIsDisabled={this.state.advancedIsDisabled}
                launchIsDisabled={this.state.launchIsDisabled}
            />
        );
    },

    renderAdvancedOptions: function() {
        return (
            <AdvancedLaunchStep {...this.state.advancedSettings}
                onAddAttachedScript={this.onAddAttachedScript}
                onRemoveAttachedScript={this.onRemoveAttachedScript}
                cancelAdvanced={this.onCancelAdvanced}
                onSaveAdvanced={this.onSaveAdvanced}
            />
        );
    },

    renderBackButton: function() {
        if (this.state.view === "BASIC_VIEW") {
            return (
                <a onClick={this.onBack}>
                    <span className="glyphicon glyphicon-arrow-left"/> Back
                </a>
            )
        }
    },

    render: function() {
        return (
            <div className="modal fade">
                <div className="modal-dialog" style={{width:"100%", maxWidth:"800px"}}>
                    <div className="modal-content">
                        <div className="modal-header instance-launch">
                            {this.renderCloseButton()}
                            <h2 className="headline">Launch an Instance/ {this.state.title}</h2>
                            {this.renderBackButton()}
                        </div>
                        <div className="modal-body">
                            {this.renderBody()}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});
