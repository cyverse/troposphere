// Author's Note:
// Although this feature is a step in the right direction, we should try to solve
// a few problems with how we deal with state and async requests that are dependent
// on each other. For example, because we are waiting for data on network requests,
// for data we want in state, we would need to set state on these values by calling
// setState from a change listener, however because we might already have it, we also
// need to set state from the event listener. Another requirement is that we are populating
// default values that are dependent on other values the user might change, so many event
// listeners will call setState on those dependent values as well. All of this logic is currently
// duplicated in every place mentioned. One solution might be to contain all of this
// dependent logic in a single function that is called by passing the key value
// pair to be changed and returns a new object to pass into setState from any call site we wish.

import React from "react";
import Backbone from "backbone";
import _ from "underscore";
import context from "context";
import modals from "modals";
import subscribe from "utilities/subscribe";
import globals from "globals";
import actions from "actions";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import { filterEndDate } from "utilities/filterCollection";

import ImageSelectStep from "./launch/steps/ImageSelectStep";
import ProjectCreateView from "components/common/ProjectCreateView";
import BasicLaunchStep from "./launch/steps/BasicLaunchStep";
import AdvancedLaunchStep from "./launch/steps/AdvancedLaunchStep";
import LicenseStep from "./launch/steps/LicenseStep";

// This class implements the instance launch walkthrough. By design it keeps
// track of two states. First is the state for switching between separate
// views of the modal. The second is the state for launching an actual
// instance, i.e. the state requisite for the launch api call (see
// onSubmitLaunch). Do not add state friviously. This component operates by
// defining all the operations to update its state as functions which it
// passes to the appropriate children.
const InstanceLaunchWizardModal = React.createClass({
    mixins: [BootstrapModalMixin],

    displayName: "InstanceLaunchWizardModal",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model),
        project: React.PropTypes.instanceOf(Backbone.Model),
        onConfirm: React.PropTypes.func.isRequired,
        initialView: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        let { AllocationSourceStore, ProjectStore, ProviderStore, ImageVersionStore, SizeStore } = this.props.subscriptions;
        this.props.addSubscriber(this.updateState);

        // We might have these
        let image = this.props.image ? this.props.image : null;
        let instanceName = image ? image.get("name") : null;
        let allocationSource, imageVersion;
        let project = this.props.project ? this.props.project : null;
        let view = this.props.initialView;

        if (image) {
            let imageVersionList = ImageVersionStore.fetchWhere({
                image_id: image.id
            });
            if (imageVersionList && !imageVersion) {
                imageVersionList = imageVersionList.cfilter(filterEndDate);
                imageVersion = imageVersionList.first();
            }
        }
        // We might get defaults on these, and need to start querying if we dont
        let allocationSourceList = AllocationSourceStore.getAll();
        if (allocationSourceList) {
            allocationSource = allocationSourceList.first();
        }

        // Check if the user has any projects, if not then set view to "PROJECT_VIEW"
        // to create a new one
        let projectList = ProjectStore.getAll();
        if (projectList) {
            if (view != "IMAGE_VIEW" && projectList.length === 0) {
                view = "PROJECT_VIEW";
            }
        }

        if (instanceName && instanceName.includes('.')) {
            instanceName = instanceName.replace(/\./g, '_');
        }

        if (!project && projectList) {
            project = projectList.first();
        }

        return {
            // State for general operation (switching views, etc)
            view,
            image,
            showValidationErr: false,

            // State for launch
            instanceName,
            imageVersion,
            project,
            providerSize: null,
            identityProvider: null,
            attachedScripts: [],
            allocationSource
        }
    },

    updateState: function() {
        let { AllocationSourceStore, ProjectStore, ProviderStore, IdentityStore, ImageVersionStore, SizeStore } = this.props.subscriptions;
        let allocationSourceList = AllocationSourceStore.getAll();
        let view = this.props.initialView;

        // Check if the user has any projects, if not then set view to "PROJECT_VIEW"
        // to create a new one
        let projectList = ProjectStore.getAll();
        if (projectList) {
            if (view != "IMAGE_VIEW" && projectList.length === 0) {
                this.viewProject();
            }
        }

        let project = this.state.project;
        if (!project && projectList) {
            project = projectList.first();
        }

        let imageVersionList;
        if (this.state.image) {
            imageVersionList = ImageVersionStore.fetchWhere({
                image_id: this.state.image.id
            });
        }

        let imageVersion = this.state.imageVersion;
        if (imageVersionList && !imageVersion) {
            imageVersionList = imageVersionList.cfilter(filterEndDate);
            imageVersion = imageVersionList.first();
        }

        let providerList, identityList;
        if (imageVersion) {
            providerList = ProviderStore.getProvidersForVersion(imageVersion);
        }

        let provider = this.state.provider;
        if (providerList) {
            identityList = this.getIdentitiesForProviderList(providerList);
            provider = provider || providerList.shuffle()[0];
        }

        //FIXME: providerSizeList should be based on the selected identity rather than the provider (minute detail for now)
        let identityProvider,
            providerSizeList;
        if (provider) {
            identityProvider = IdentityStore.findOne({
                "provider.id": provider.id
            });
            providerSizeList = SizeStore.fetchWhere({
                provider__id: provider.id
            });
        }
        if (identityList) {
            identityProvider = this.getIdentityFromList(identityList);
        }

        if (provider && providerSizeList && imageVersion) {
            providerSizeList =
                this.filterSizeList(provider, providerSizeList, imageVersion);
        }

        let providerSize = this.state.providerSize;
        if (providerSizeList) {
            providerSize = providerSize || providerSizeList.first();
        }

        let allocationSource;
        if (allocationSourceList) {
            allocationSource = this.state.allocationSource || allocationSourceList.first();
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
            allocationSource,
        });
    },

    viewImageSelect: function() {
        this.setState({
            view: "IMAGE_VIEW"
        });
    },

    viewProject: function() {
        this.setState({
            view: "PROJECT_VIEW"
        });
    },

    viewBasic: function() {
        this.setState({
            view: "BASIC_VIEW"
        });
    },

    viewAdvanced: function() {
        this.setState({
            view: "ADVANCED_VIEW"
        });
    },

    viewLicense: function() {
        this.setState({
            view: "LICENSE_VIEW"
        });
    },

    //=========================
    // Event Handlers
    //=========================

    onSelectImage: function(image) {
        let instanceName = image.get("name");

        if (instanceName && instanceName.includes('.')) {
            instanceName = instanceName.replace(/\./g, '_');
        }

        let { SizeStore, ProviderStore, ImageVersionStore } = this.props.subscriptions;
        let imageVersionList = ImageVersionStore.fetchWhere({
            image_id: image.id
        });

        let imageVersion;
        if (imageVersionList) {
            imageVersionList = imageVersionList.cfilter(filterEndDate);
            imageVersion = imageVersionList.first();
        }

        let providerList;
        if (imageVersion) {
            providerList = ProviderStore.getProvidersForVersion(imageVersion);
        }

        let provider,
            identityList,
            providerSizeList,
            identityProvider;
        if (providerList) {
            provider = providerList.first();
        }
        if(provider) {
            providerSizeList = SizeStore.fetchWhere({
                provider__id: provider.id
            });
            identityList = this.getIdentitiesForProviderList(providerList);

        }
        if (identityList) {
            identityProvider = this.getIdentityFromList(identityList);
        }
        if (provider && providerSizeList && imageVersion) {
            providerSizeList =
                this.filterSizeList(provider, providerSizeList, imageVersion);
        }

        let providerSize;
        if (providerSizeList) {
            providerSize = providerSizeList.first();
        }

        this.setState({
            image,
            instanceName,
            provider,
            imageVersion,
            providerSize,
            identityProvider,
        }, this.viewBasic);
    },

    onBack: function() {
        this.viewImageSelect();
    },

    onNameChange: function(e) {
        this.setState({
            instanceName: e.target.value
        });
    },

    onNameBlur: function(e) {
        let instanceName = this.state.instanceName.trim();
        this.setState({
            instanceName
        });
    },

    onVersionChange: function(imageVersion) {
        let { ProviderStore, SizeStore } = this.props.subscriptions;
        let providerList = ProviderStore.getProvidersForVersion(imageVersion);
        let identityList,
            providerSizeList;
        let providerSize;
        let identityProvider, provider;
        if (providerList) {
            provider = providerList.first();
        }

        if (provider) {
            providerSizeList = SizeStore.fetchWhere({
                provider__id: provider.id
            });

            identityList = this.getIdentitiesForProviderList(providerList);
        }

        if (provider && providerSizeList && imageVersion) {
            providerSizeList =
                this.filterSizeList(provider, providerSizeList, imageVersion);
        }

        if (providerSizeList) {
            providerSize = providerSizeList.first();
        }
        if (identityList) {
            identityProvider = this.getIdentityFromList(identityList);
        }
        this.setState({
            imageVersion,
            provider,
            providerSize,
            identityProvider
        });
    },

    getIdentityFromList: function(identityList) {
        let current = this.state.identityProvider,
            current_id = (current == null) ? -1 : current.id,
            identityProvider = identityList.find(function(identity) { return identity.id == current_id; });
        if (! identityProvider) {
            identityProvider = identityList.first();
        }
        return identityProvider;
    },

    onProjectChange: function(project) {
        let { ProviderStore } = this.props.subscriptions;
        let identityProvider, provider,
            providerList = ProviderStore.getProvidersForVersion(this.state.imageVersion),
            identityList = this.getIdentitiesForProviderList(providerList);
        if (identityList) {
            identityProvider = this.getIdentityFromList(identityList);
            provider = ProviderStore.findOne({
                "id": identityProvider.get('provider').id
            });
        } else {
            provider = null;
            identityProvider = null;
        }
        this.setState({
            project,
            provider,
            identityProvider
        });
    },

    onAllocationSourceChange: function(source) {
        this.setState({
            allocationSource: source,
        });
    },

    onIdentityChange: function(identityProvider) {
        let { ProviderStore, SizeStore } = this.props.subscriptions;
        let provider = ProviderStore.findOne({
            "id": identityProvider.get('provider').id
        });

        let providerSizeList = SizeStore.fetchWhere({
            provider__id: provider.id
        });

        let imageVersion = this.state.imageVersion;
        if (provider && providerSizeList && imageVersion) {
            providerSizeList =
                this.filterSizeList(provider, providerSizeList, imageVersion);
        }

        let providerSize;
        if (providerSizeList) {
            providerSize = providerSizeList.first();
        }

        if (providerSizeList) {
            providerSize = providerSizeList.first();
        }
        ;

        this.setState({
            provider,
            providerSize,
            identityProvider
        });
    },

    onSizeChange: function(providerSize) {
        this.setState({
            providerSize
        });
    },

    onRequestResources: function() {
        this.hide();
        modals.HelpModals.requestMoreResources({
            identity: this.state.identityProvider.id
        });
    },

    onAddAttachedScript: function(value) {
        let attachedScripts = this.state.attachedScripts;
        if (attachedScripts.indexOf(value) === -1) {
            this.setState({
                attachedScripts: [...attachedScripts, value]
            });
        }
    },

    onRemoveAttachedScript: function(item) {
        let attachedScripts = this.state.attachedScripts
            .filter((i) => i != item);

        this.setState({
            attachedScripts
        });
    },

    onSaveAdvanced: function() {
        this.viewBasic()
    },

    onClearAdvanced: function() {
        this.setState({
            attachedScripts: []
        });
    },

    onProjectCreateConfirm: function(name, description, groupOwner) {
        this.viewBasic();
        actions.ProjectActions.create({
            name: name,
            description,
            owner: groupOwner,
        });
    },

    filterSizeList(provider, sizes, imageVersion) {
        let selectedMachine =
            imageVersion.get('machines')
                        .find(m => m.provider.id == provider.id);

        let largeEnough = size =>
            // Disk size of 0 specially treated in Openstack, the size will be
            // the size of the image
            size.get('disk') === 0 ||
            size.get('disk') >= selectedMachine.size_gb;

        // Return provider sizes that have enough disk space
        return sizes.cfilter(largeEnough);
    },

    //============================
    // Final Submit event handler
    //============================

    onSubmitLaunch: function() {
        let licenseList = this.state.imageVersion.get("licenses");
        if (this.canLaunch()) {
            if (licenseList.length >= 1 && this.state.view === "BASIC_VIEW") {
                this.viewLicense();
                return
            }

            let launchData = {
                project: this.state.project,
                instanceName: this.state.instanceName.trim(),
                identity: this.state.identityProvider,
                size: this.state.providerSize,
                version: this.state.imageVersion,
                scripts: this.state.attachedScripts
            };

            if (globals.USE_ALLOCATION_SOURCES) {
                launchData.allocation_source_uuid = this.state.allocationSource.get("uuid");
            }

            actions.InstanceActions.launch(launchData);
            this.hide();
            return
        }

        this.setState({
            showValidationErr: true
        })
    },


    //======================
    // Validation
    //======================

    hasAdvancedOptions: function() {
        //TODO: Once more advanced options are added,
        //this will need to be a recursive check.
        return (this.state.attachedScripts.length > 0)
    },

    // Returns true if instance launch will exceed the user's allotted
    // resources.
    exceedsResources: function() {
        let { InstanceStore } = this.props.subscriptions;
        let provider = this.state.provider;
        let identityProvider = this.state.identityProvider;
        let size = this.state.providerSize;

        if (identityProvider && size && provider) {
            let resourcesUsed = InstanceStore.getTotalResources(provider.id);

            /* eslint-disable no-unused-vars */

            // AU's Used
            let allocationConsumed,
                allocationTotal;

            // If we are not using AllocationSource set to provider
            if (globals.USE_ALLOCATION_SOURCES) {
                let allocationSource = this.state.allocationSource;
                allocationConsumed = allocationSource.get("compute_used");
                allocationTotal = allocationSource.get("compute_allowed");
            } else {
                allocationConsumed = identityProvider.get("usage").current;
                allocationTotal = identityProvider.get("usage").threshold;
            }

            // CPU's have used + will use
            let allocationCpu = identityProvider.get("quota").cpu;
            let cpuWillTotal = resourcesUsed.cpu + size.get("cpu");

            // Memory have used + will use
            let allocationMem = identityProvider.get("quota").memory;
            let memUsed = resourcesUsed.mem / 1024;
            let memWillTotal = memUsed + size.get("mem");
            //NOTE: Forcibly removed to disable enforcement on the UI side - By Sgregory
            // if (allocationConsumed >= allocationTotal) {
            //     return true;
            // }
            /* eslint-enable no-unused-vars */
            if (cpuWillTotal > allocationCpu) {
                return true;
            }
            if (memWillTotal > allocationMem) {
                return true;
            }
            return false
        }
        return true;
    },

    invalidName() {
      let regex = /\.(\d)+$/gm;
      return this.state.instanceName.match(regex);
    },

    canLaunch: function() {
        let requiredFields = ["instanceName", "project", "identityProvider", "providerSize", "imageVersion", "attachedScripts"];

        // Check if we are using AllocationSource and add to requierd fields
        if (globals.USE_ALLOCATION_SOURCES) {
            requiredFields.push("allocationSource");
        }

        // All required fields are truthy
        let requiredExist = _.every(requiredFields, (prop) => Boolean(this.state[prop]))

        return (
            requiredExist
            && !this.exceedsResources()
            && !this.invalidName()
        )
    },

    //==================
    // View Routing
    //==================

    renderBody: function() {
        let view = this.state.view;
        switch (view) {
            case "IMAGE_VIEW":
                return this.renderImageSelect()
            case "PROJECT_VIEW":
                return this.renderProjectCreateStep()
            case "BASIC_VIEW":
                return this.renderBasicOptions()
            case "ADVANCED_VIEW":
                return this.renderAdvancedOptions()
            case "LICENSE_VIEW":
                return this.renderLicenseStep()
        }
    },

    headerTitle: function() {
        let view = this.state.view;
        switch (view) {
            case "IMAGE_VIEW":
                return "Select an Image"
            case "PROJECT_VIEW":
                return "Create New Project"
            case "BASIC_VIEW":
                return "Basic Options"
            case "ADVANCED_VIEW":
                return "Advanced Options"
            case "LICENSE_VIEW":
                return "License Agreement"
        }
    },

    //========================
    // Render Methods
    //========================

    renderImageSelect: function() {
        return (
        <ImageSelectStep image={this.state.image} onSelectImage={this.onSelectImage} onCancel={this.hide} />
        );
    },

    getIdentitiesForProviderList: function(providerList) {
        let { IdentityStore } = this.props.subscriptions;
        let provider_ids = providerList.map(function (provider) { return provider.get('id') }),
            current_user = context.profile.get('username'),
            group = this.state.project.get('owner'),
            ownedIdentityList = IdentityStore.getIdentitiesForGroup(group, current_user);
        if (!ownedIdentityList) {
            return ownedIdentityList;
        }
        var filteredIdentities = ownedIdentityList.cfilter(function (ident) {
            let provider_id = ident.get('provider').id;
            if ( provider_ids.indexOf(provider_id) < 0) {
                return false;
            }
            return true;
        });
        return filteredIdentities;
    },

    renderProjectCreateStep: function() {
        return (
            <ProjectCreateView cancel={this.hide} onConfirm={this.onProjectCreateConfirm} />
        );
    },

    renderBasicOptions: function() {

        let provider = this.state.provider;
        let providerSize = this.state.providerSize;
        let project = this.state.project;
        let image = this.state.image;
        let imageVersion = this.state.imageVersion;
        let identityProvider = this.state.identityProvider;
        let { InstanceStore, SizeStore, ImageVersionStore, ProjectStore, ProviderStore } = this.props.subscriptions;
        let projectList = ProjectStore.getAll() || null;

        let imageVersionList;
        if (this.state.image) {
            imageVersionList = ImageVersionStore.fetchWhere({
                image_id: this.state.image.id
            });

            if (imageVersionList) {
                imageVersionList = imageVersionList.cfilter(filterEndDate);
            }
        }

        let providerList, identityList;
        if (imageVersion) {
            providerList = ProviderStore.getProvidersForVersion(imageVersion);
        }

        if (providerList) {
            identityList = this.getIdentitiesForProviderList(providerList);
        }

        if (identityList) {
            identityProvider = this.getIdentityFromList(identityList);
        }
        let providerSizeList,
            resourcesUsed;
        if (provider) {
            resourcesUsed = InstanceStore.getTotalResources(provider.id);

            providerSizeList = SizeStore.fetchWhere({
                provider__id: provider.id
            });
        }

        if (provider && providerSizeList && imageVersion) {
            providerSizeList =
                this.filterSizeList(provider, providerSizeList, imageVersion);
        }

        let allocationSourceList;
        if (globals.USE_ALLOCATION_SOURCES) {
            let { AllocationSourceStore } = this.props.subscriptions;
            allocationSourceList = AllocationSourceStore.getAll();
        }

        return (
        <BasicLaunchStep { ...{ showValidationErr: this.state.showValidationErr, attachedScripts: this.state.attachedScripts, backIsDisabled: this.props.initialView=="BASIC_VIEW"
            , launchIsDisabled: !this.canLaunch(), identity: identityProvider, identityProvider: identityProvider, image, imageVersion, imageVersionList, instanceName: this.state.instanceName,
            onBack: this.onBack, onCancel: this.hide, onNameChange: this.onNameChange, onNameBlur: this.onNameBlur, onProjectChange: this.onProjectChange, onAllocationSourceChange:
            this.onAllocationSourceChange, onIdentityChange: this.onIdentityChange, onRequestResources: this.onRequestResources, onSizeChange: this.onSizeChange, onSubmitLaunch:
            this.onSubmitLaunch, onVersionChange: this.onVersionChange, project, projectList, provider, providerList, identityList, providerSize, providerSizeList, resourcesUsed, viewAdvanced:
            this.viewAdvanced, hasAdvancedOptions: this.hasAdvancedOptions(), allocationSource: this.state.allocationSource, allocationSourceList, }} />
        )
    },

    renderAdvancedOptions: function() {
        let { ScriptStore } = this.props.subscriptions;
        let bootScriptList = ScriptStore.getAll();
        return (
        <AdvancedLaunchStep bootScriptList={bootScriptList}
            attachedScripts={this.state.attachedScripts}
            onAddAttachedScript={this.onAddAttachedScript}
            onRemoveAttachedScript={this.onRemoveAttachedScript}
            onClearAdvanced={this.onClearAdvanced}
            onSaveAdvanced={this.onSaveAdvanced}
            hasAdvancedOptions={this.hasAdvancedOptions()} />
        );
    },

    renderLicenseStep: function() {
        let licenseList = this.state.imageVersion.get("licenses");

        if (!licenseList) {
            return
        }
        return (
        <LicenseStep licenseList={licenseList}
            onSubmitLaunch={this.onSubmitLaunch}
            onBack={this.viewBasic}
            onCancel={this.hide} />
        )
    },

    render: function() {
        return (
        <div className="modal fade">
            <div className="modal-dialog" style={{ width: "100%", maxWidth: "800px" }}>
                <div className="modal-content">
                    <div className="modal-header instance-launch">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Launch an Instance / {this.headerTitle()}</h1>
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

export default subscribe(
    InstanceLaunchWizardModal,
    [
        "ProviderStore", "ProjectStore", "AllocationSourceStore", "IdentityStore",
        "InstanceStore", "SizeStore", "ImageVersionStore", "ScriptStore"]);
