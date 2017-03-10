import React from "react";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import stores from "stores";
import ResourcesForm from "components/modals/instance/launch/components/ResourcesForm";
import globals from "globals";

export default React.createClass({
    displayName: "InstanceResizeModal",

    mixins: [BootstrapModalMixin],

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function(resize_size) {
        this.hide();
        this.props.onConfirm(resize_size);
    },
    confirmResize: function() {
        this.hide();
        let size = this.state.providerSize;
        this.props.onConfirm(size.attributes.alias);
    },

    // Render
    // ------
    //

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model),
        onConfirm: React.PropTypes.func.isRequired,
    },

    getInitialState: function() {

        let project = this.props.project ? this.props.project : null;
        // Check if the user has any projects, if not then set view to "PROJECT_VIEW"
        // to create a new one
        let projectList = stores.ProjectStore.getAll();

        return {
            provider: null,
            // State for launch
            project,
            providerSize: null,
            identityProvider: null,
            allocationSource: null
        }
    },

    // Set the component's state based on cloud defaults.
    //
    // Whenever the wizard mounts it listens for changes from the stores,
    // passing this function as a callback. Incrementally it calls stores to
    // fetch data. It only sets state for defaults, i.e. if project is null,
    // set the project to the first returned from the cloud. It primes our
    // stores, so that render can just call get and eventually get data.
    updateState: function() {
        let allocationSourceList = stores.AllocationSourceStore.getAll();


        // Check if the user has any projects, if not then set view to "PROJECT_VIEW"
        // to create a new one
        let projectList = stores.ProjectStore.getAll();

        let project = this.state.project;
        if (!project && projectList) {
            project = projectList.first();
        }


        let providerList;
        providerList = stores.ProviderStore.getAll();


        let provider = this.state.provider;
        if (providerList) {
            provider = provider || providerList.shuffle()[0];
        }

        let identityProvider,
            providerSizeList;
        if (provider) {
            identityProvider = stores.IdentityStore.findOne({
                "provider.id": provider.id
            });

            providerSizeList = stores.SizeStore.fetchWhere({
                provider__id: provider.id
            });
        }

        let providerSize;
        if (providerSizeList) {
            providerSize = this.state.providerSize ?
                this.state.providerSize :
                providerSizeList.first();
        };

        let allocationSource;
        if (allocationSourceList) {
            allocationSource = this.state.allocationSource || allocationSourceList.first();
        }

        // NOTE: Only update state for things that need defaults. Data fetched
        // from the cloud is not part of the component's state that it
        // manages.
        this.setState({
            project,
            provider,
            providerSize,
            identityProvider,
            allocationSource,
        });
    },

    componentDidMount: function() {
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);
        stores.ProjectStore.addChangeListener(this.updateState);

        if (globals.USE_ALLOCATION_SOURCES) {
            stores.AllocationSourceStore.addChangeListener(this.updateState);
        }

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

        if (globals.USE_ALLOCATION_SOURCES) {
            stores.AllocationSourceStore.removeChangeListener(this.updateState);
        }
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


    onAllocationSourceChange: function(source) {
        this.setState({
            allocationSource: source,
        });
    },

    onProviderChange: function(provider) {
        let providerSizeList = stores.SizeStore.fetchWhere({
            provider__id: provider.id
        });

        let providerSize;

        let identityProvider = stores.IdentityStore.findOne({
            "provider.id": provider.id
        });

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

    //confirmResizeA: function() {
    //    this.hide();
     //   let size = this.state.providerSize;
     //   console.log(size);
    //    console.log(size.attributes.alias);
    //    this.props.onConfirm(size.attributes.alias);
   // },

    renderBody: function() {
        let provider = this.state.provider;
        let providerSize = this.state.providerSize;
        let project = this.state.project;

        let projectList = stores.ProjectStore.getAll() || null;


        let providerList;
        providerList = stores.ProviderStore.getAll();


        let providerSizeList,
            resourcesUsed;
        if (provider) {
            resourcesUsed = stores.InstanceStore.getTotalResources(provider.id);

            providerSizeList = stores.SizeStore.fetchWhere({
                provider__id: provider.id
            });
        }

        let allocationSourceList;
        if (globals.USE_ALLOCATION_SOURCES) {
            allocationSourceList = stores.AllocationSourceStore.getAll();
        }


        return (
        <ResourcesForm {...{showValidationErr: this.state.showValidationErr, identityProvider: this.state.identityProvider, onCancel: this.hide, onAllocationSourceChange:
            this.onAllocationSourceChange, onProviderChange: this.onProviderChange, onSizeChange: this.onSizeChange, allocationSource: this.state.allocationSource, allocationSourceList,
            project, projectList, provider, providerList, providerSize, providerSizeList, resourcesUsed}} />
        );

    },

    render: function() {
        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Resize Instance</h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={this.cancel}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={this.confirmResize}>
                            Resize
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
