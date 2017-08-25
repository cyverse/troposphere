import React from "react";
import Backbone from "backbone";
import Tooltip from "react-tooltip";

import context from "context";
import globals from "globals";
import subscribe from "utilities/subscribe";
import featureFlags from "utilities/featureFlags";

import ResourceGraphs from "../components/ResourceGraphs";
import ProviderAllocationGraph from "../components/ProviderAllocationGraph";
import AllocationSourceGraph from "components/common/AllocationSourceGraph";
import SelectMenu from "components/common/ui/SelectMenu";

const ExclamationMark = React.createClass({
    getInitialState() {
        return {
            opacity: "0.4",
        };
    },
    onMouseOver() {
        this.setState({
            opacity: "1"
        });
    },
    onMouseOut() {
        this.setState(this.getInitialState());
    },
    render() {
        let opacity = this.props.tip ? this.state.opacity : "0";
        let rand = Math.random() + "";
        return (
        <span><span onMouseOver={this.onMouseOver}
                  onMouseOut={this.onMouseOut}
                  style={{ opacity }}
                  data-tip={this.props.tip}
                  data-for={rand}
                  className="glyphicon glyphicon-exclamation-sign"
                  aria-hidden="true"></span>
        <Tooltip id={rand} place="right" effect="solid" />
        </span>
        );
    }
});

const ResourcesForm = React.createClass({
    propTypes: {
        identity: React.PropTypes.instanceOf(Backbone.Model),
        providerSizeList: React.PropTypes.instanceOf(Backbone.Collection),
        identityList: React.PropTypes.instanceOf(Backbone.Collection),
        providerSize: React.PropTypes.instanceOf(Backbone.Model),
        allocationSourceList: React.PropTypes.instanceOf(Backbone.Collection),
        allocationSource: React.PropTypes.instanceOf(Backbone.Model),
        onSizeChange: React.PropTypes.func,
        onIdentityChange: React.PropTypes.func
    },

    getProviderSizeName(providerSize) {
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

    renderAllocationSourceMenu() {
        let { allocationSource,
              allocationSourceList,
              onAllocationSourceChange,
              waitingOnLaunch } = this.props;

        return (
        <div className="form-group">
            <label htmlFor="allocationSource">
                Allocation Source
            </label>
            <SelectMenu current={allocationSource}
                disabled={waitingOnLaunch}
                list={allocationSourceList}
                optionName={as => as.get("name")}
                onSelect={onAllocationSourceChange} />
        </div>
        );
    },

    renderAllocationSourceGraph() {
        return (
        <AllocationSourceGraph { ...this.props } />
        );
    },

    renderProviderGraph() {
        //FIXME: Identity-specific this quota could change.
        return (
        <ProviderAllocationGraph { ...this.props } />
        );
    },
    identityToOptionName: function(ident) {
        let optionText = ident.toString();

        return optionText;
    },

    renderIdentityLabel: function() {
        let { IdentityStore } = this.props.subscriptions;
        let current_user = context.profile.get('username'),
            allIdentities = IdentityStore.ownedIdentities(current_user);

        if (allIdentities == null || this.props.identityList == null || allIdentities.models.length == this.props.identityList.models.length) {
            return (
                <label htmlFor="identity">
                    Identity
                </label>
            );
        }
        let remaining = allIdentities.models.length - this.props.identityList.models.length,
            total = allIdentities.models.length;
        let tipStr;
        if( featureFlags.hasProjectSharing()) {
            tipStr = remaining + " of your "+total+" identities have been removed from this list based on the availability of the Base Image Version and Project";
        } else {
            tipStr = remaining + " of your "+total+" identities have been removed from this list based on the availability of the Base Image Version";
        }

        return (
        <label htmlFor="identity">
            Identity
            <ExclamationMark tip={tipStr} />
        </label>
        );
    },
    renderProvider() {
        let { provider,
              providerList,
              onProviderChange,
              waitingOnLaunch } = this.props;

        return (
            <div className="form-group">
                <label htmlFor="provider">
                    Provider
                </label>
                <SelectMenu id="provider"
                            current={ provider }
                            disabled={waitingOnLaunch}
                            optionName={ prov => prov.get('name') }
                            list={ providerList }
                            onSelect={ onProviderChange } />
            </div>
        );
    },
    renderIdentity() {
        let { identity,
              identityList,
              onIdentityChange,
              waitingOnLaunch } = this.props;

        return (
            <div className="form-group">
                {this.renderIdentityLabel()}
                <SelectMenu id="identity"
                            disabled={waitingOnLaunch}
                            current={ identity }
                            optionName={ ident => this.identityToOptionName(ident) }
                            list={ identityList }
                            onSelect={ onIdentityChange } />
            </div>
        );
    },
    render: function() {
        let { providerSize,
              providerSizeList,
              onSizeChange,
              waitingOnLaunch } = this.props;

        return (
        <form>
            {globals.USE_ALLOCATION_SOURCES
             ? this.renderAllocationSourceMenu()
             : null}
            {featureFlags.hasProjectSharing() ? this.renderIdentity() : this.renderProvider()}
            <div className="form-group">
                <label htmlFor="instanceSize">
                    Instance Size
                </label>
                <SelectMenu current={providerSize}
                    disabled={waitingOnLaunch}
                    optionName={this.getProviderSizeName}
                    list={providerSizeList}
                    onSelect={onSizeChange} />
            </div>
            <div className="form-group">
                {globals.USE_ALLOCATION_SOURCES
                 ? this.renderAllocationSourceGraph()
                 : this.renderProviderGraph()}
                <ResourceGraphs { ...this.props } />
            </div>
        </form>
        );
    },
});

export default subscribe(
    ResourcesForm,
    ["IdentityStore"])
