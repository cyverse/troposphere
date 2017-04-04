import React from "react";
import Backbone from "backbone";
import Tooltip from "react-tooltip";

import globals from "globals";
import stores from "stores";
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

export default React.createClass({
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
              onAllocationSourceChange } = this.props;

        return (
        <div className="form-group">
            <label htmlFor="allocationSource">
                Allocation Source
            </label>
            <SelectMenu current={allocationSource}
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
    renderIdentitySelectOptionName: function(ident) {
        return ident.getCredentialValue('key')
            + "/" + ident.getCredentialValue('ex_project_name')
            + " on " + ident.get("provider").name;
    },

    renderIdentityLabel: function() {
        let allIdentities = stores.IdentityStore.getAll();
        if (allIdentities == null || this.props.identityList == null || allIdentities.models.length == this.props.identityList.models.length) {
            return (
                <label htmlFor="identity">
                    Identity
                </label>
            );
        }
        let tipStr = "One or more of your identities have been removed from this list, based on the selection of 'Project' and 'Version'";
        //let numFiltered = (allIdentities.models.length - this.props.identityList.models.length),
        //    total = allIdentities.models.length;
        //let tipStr = "" + numFiltered + " of "+ total+" shared identities have been filtered out based on the combination of 'project' and 'version'.";

        return (
        <label htmlFor="identity">
            Identity
            <ExclamationMark tip={tipStr} />
        </label>
        );
    },
    render: function() {
        let { identity,
              identityList,
              onIdentityChange,
              providerSize,
              providerSizeList,
              onSizeChange } = this.props;
        return (
        <form>
            {globals.USE_ALLOCATION_SOURCES
             ? this.renderAllocationSourceMenu()
             : null}
            <div className="form-group">
                {this.renderIdentityLabel()}
                <SelectMenu id="identity"
                            current={ identity }
                            optionName={ ident => this.renderIdentitySelectOptionName(ident) }
                            list={ identityList }
                            onSelect={ onIdentityChange } />
            </div>
            <div className="form-group">
                <label htmlFor="instanceSize">
                    Instance Size
                </label>
                <SelectMenu current={providerSize}
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
