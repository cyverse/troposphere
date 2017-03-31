import React from "react";
import Backbone from "backbone";
import stores from "stores";
import ProviderCollection from "collections/ProviderCollection";
import IdentityCollection from "collections/IdentityCollection";
import ProviderSummaryLinePlot from "components/dashboard/plots/ProviderSummaryLinePlot";
import ResourceStatusSummaryPlot from "components/dashboard/plots/ResourceStatusSummaryPlot";


export default React.createClass({
    displayName: "Resources",

    propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    componentDidMount: function() {
        stores.InstanceStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.VolumeStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.VolumeStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        this.forceUpdate();
    },

    render: function() {
        let provider = this.props.provider,
            identity = stores.IdentityStore.findOne({
                "provider.id": provider.id
            }),
            instances = stores.InstanceStore.findWhere({
                "provider.id": provider.id
            }),
            volumes = stores.VolumeStore.findWhere({
                "provider.id": provider.id
            }),
            sizes = stores.SizeStore.fetchWhere({
                provider__id: provider.id,
                archived: true,
                page_size: 100
            });

        if (!provider || !identity || !instances || !volumes || !sizes) return <div className="loading"></div>;

        let providers = new ProviderCollection([provider]),
            identities = new IdentityCollection([identity]);

        return (
        <div className="row provider-info-section">
            <div className="provider">
                <div className="row">
                    <div className="col-md-8">
                        <ProviderSummaryLinePlot providers={providers}
                            identities={identities}
                            instances={instances}
                            volumes={volumes}
                            sizes={sizes} />
                    </div>
                    <div className="col-md-4">
                        <ResourceStatusSummaryPlot title="Instances" provider={provider.id} resources={instances} />
                        <ResourceStatusSummaryPlot title="Volumes" provider={provider.id} resources={volumes} />
                    </div>
                </div>
            </div>
        </div>
        );

    }
});
