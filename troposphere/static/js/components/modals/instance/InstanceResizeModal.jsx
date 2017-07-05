import React from "react";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import stores from "stores";
import ResourceGraphs from "components/modals/instance/launch/components/ResourceGraphs";
import SelectMenu from "components/common/ui/SelectMenu";
import Glyphicon from "components/common/Glyphicon";
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
        instance: React.PropTypes.instanceOf(Backbone.Model),
        size: React.PropTypes.instanceOf(Backbone.Model),
        type: React.PropTypes.string.isRequired,
        onConfirm: React.PropTypes.func.isRequired,
    },

    getInitialState: function() {
        return {
            providerSize: null,
            provider: null
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

        let providerList;
        providerList = stores.ProviderStore.getAll();


        let provider = this.state.provider;
        if (providerList) {
            let provider_id = this.props.instance.get('provider').id;
            provider = stores.ProviderStore.get(provider_id);
        }

        let providerSizeList;
        let identityProvider = null;
        if (provider) {
            providerSizeList = stores.SizeStore.fetchWhere({
                provider__id: provider.id
            });

            identityProvider = stores.IdentityStore.findOne({
                    "provider.id": provider.id
            });
        }

        let providerSize;
        if (providerSizeList) {
            providerSize = this.state.providerSize ?
                this.state.providerSize :
                providerSizeList.first();
        };

        // NOTE: Only update state for things that need defaults. Data fetched
        // from the cloud is not part of the component's state that it
        // manages.
        this.setState({
            provider,
            identityProvider,
            providerSize,
        });
    },

    componentDidMount: function() {
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);

        // NOTE: This is not nice. This enforces that every time a component
        // mounts updateState gets called. Otherwise, if a component mounts
        // after data has been fetched, then updateState never gets called.
        this.updateState();
    },

    componentWillUnmount: function() {
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);

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
    getProviderSizeName: function(providerSize) {
        let name = providerSize.get("name");
        let cpu = providerSize.get("cpu");
        let disk = providerSize.get("disk");
        let diskStr = ""
        if (disk == 0) {
            disk = providerSize.get("root");
        }
        if (disk != 0) {
            diskStr = `Disk: ${ disk } GB`
        }
        let memory = providerSize.get("mem");

        return `${ name } (CPU: ${ cpu }, Mem: ${ memory } GB, ${ diskStr })`;
    },
    renderBody: function() {
        if(this.props.type == 'confirm') {
            return this.renderConfirmResizeBody();
        } else if (this.props.type == "revert") {
            return this.renderRevertResizeBody();
        } else {
            return this.renderStartResizeBody();
        }
    },
    renderOkText: function() {
        if(this.props.type == "confirm") {
            return "Confirm Resize"
        } else if (this.props.type == "revert") {
            return "Revert Resize"
        } else {
            return "Resize"
        }
    },
    renderRevertResizeBody: function() {
        return (
        <div>
            <p>
                {"Would you like to revert this instance to its original size?"}
            </p>
        </div>);
    },

    renderConfirmResizeBody: function() {
        return (
        <div>
            <p>
                {"Would you like to confirm this instance to its original size?"}
            </p>
            <p>
                {"NOTE: This operation cannot be undone! Be sure that your instance works as expected prior to confirming the resize."}
            </p>
        </div>);
    },

    renderStartResizeBody: function() {
        let provider = this.state.provider;
        let providerSize = this.state.providerSize;


        let providerList;
        providerList = stores.ProviderStore.getAll();


        let providerSizeList = null,
            resourcesUsed = null;
        if (provider) {
            resourcesUsed = stores.InstanceStore.getTotalResources(provider.id);

            providerSizeList = stores.SizeStore.fetchWhere({
                provider__id: provider.id
            });

        }

        return (
        <form>
            <div className="form-group">
                <p className="alert alert-danger">
                    <Glyphicon name="warning-sign" />
                    {" "}
                    <strong>WARNING</strong>
                    {" Do not resize your instance to a smaller size, as this can cause unexpected instance failure!"}
                </p>
                <label htmlFor="instanceSize">
                    Instance Size
                </label>
                <SelectMenu current={providerSize}
                    optionName={this.getProviderSizeName}
                    list={providerSizeList}
                    onSelect={this.onSizeChange} />
            </div>
            <div className="form-group">
                <ResourceGraphs
                    resourcesUsed={resourcesUsed}
                    identityProvider={this.state.identityProvider}
                    providerSize={providerSize}
                />
            </div>
        </form>
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
                            { this.renderOkText() }
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
