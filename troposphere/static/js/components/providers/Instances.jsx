import React from "react";
import Backbone from "backbone";
import stores from "stores";


export default React.createClass({
    displayName: "Instances",

    propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    componentDidMount: function() {
        stores.InstanceStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        this.forceUpdate();
    },

    renderInstanceTableRow: function(instance, sizes) {
        var size = sizes.get(instance.get("size").id),
            numberOfCpus = Number(size.get("cpu")),
            ausPerCpu = 1,
            burnRate = ausPerCpu * numberOfCpus;

        return (
        <tr key={instance.id}>
            <td>
                <span>{instance.get("name")}</span>
            </td>
            <td>
                {instance.get("state").get("status")}
            </td>
            <td>
                {instance.get("state").get("activity")}
            </td>
            <td>
                {numberOfCpus}
            </td>
            <td>
                {burnRate}
            </td>
            <td>
                {instance.get("usage")}
            </td>
        </tr>
        );
    },

    render: function() {
        var provider = this.props.provider,
            instances = stores.InstanceStore.findWhere({
                "provider.id": provider.id,
                "status": "active"
            }),
            sizes = stores.SizeStore.fetchWhere({
                provider__id: provider.id,
                archived: true,
                page_size: 100
            }),
            content = null;

        if (!provider || !instances || !sizes) return <div className="loading"></div>;

        if (instances.length > 0) {
            content = (
                <div>
                    <p>
                        The following instances are currently consuming allocation on this provider:
                    </p>
                    <table className="table table-striped table-condensed">
                        <thead>
                            <tr>
                                <th>
                                    Instance
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Activity
                                </th>
                                <th>
                                    CPUs
                                </th>
                                <th>
                                    AUs/hour
                                </th>
                                <th>
                                    Total AU
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {instances.map(function(instance) {
                                 return this.renderInstanceTableRow(instance, sizes);
                             }.bind(this))}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            content = (
                <div>
                    <p>
                        You currently have no instances using allocation.
                    </p>
                </div>
            );
        }

        return (
        <div className="row provider-info-section">
            <h4 className="t-title">Instances Consuming Allocation</h4>
            {content}
        </div>
        );

    }
});
