import React from "react";
import Backbone from "backbone";
import stores from "stores";
import Code from "components/common/ui/Code";
import CopyButton from "components/common/ui/CopyButton";
import moment from "moment";

export default React.createClass({
    displayName: "AvailabilityView",

    propTypes: {
        version: React.PropTypes
            .instanceOf( Backbone.Model ).isRequired
    },

    renderProviderMachine( provider ) {
        let { isSummary } = this.props;

        // Hide 'end-dated' provider_machines
        let endDate = provider.get( "end_date" );
        if (endDate && endDate.isValid()) return;

        // Assign strings for render
        let machineID = provider.get( "uuid" );
        let providerName = provider.get( "provider" ).name;

        // Optionally render the UUID if not set as
        // summary by parent
        let optMachineID;
        if (!isSummary) {
            optMachineID = (
                <div>
                    <Code mb="10px">
                        { machineID }
                    </Code>
                    <CopyButton text={ machineID }/>
                </div>
            );
        }

        let key = `${providerName}-${machineID}`;
        return (
            <div key={ key }>
                { providerName }<br/>{ optMachineID }
            </div>
        )
    },

    render() {
        let { version } = this.props;
        let endDate = version.get('end_date'),
            isEndDated = endDate && endDate.isValid();
        // No availability if the version *OR* parent-image are end-dated.
        if (!isEndDated) {
            let image = version.get('image');
            let end_date = moment(image.end_date);
            isEndDated = end_date && end_date.isValid();
        }

        if (isEndDated) {
            return this.renderEndDated();
        } else {
            return this.renderProviders();
        }
    },
    renderEndDated() {
        return (
            <div>
                <h4
                    className="t-body-2"
                    style={{ marginBottom: "5px" }}
                >
                    Not Available
                </h4>
            </div>
        );
    },
    renderProviders() {
        let { version } = this.props;
        // Get providers this version is available on
        let machines = stores.ProviderMachineStore
            .getMachinesForVersion(version);

        // If there are any providers for this machine
        // map to render the list
        let providers;
        if ( machines ) {
            providers = machines
                .map(this.renderProviderMachine);
        }

        return (
            <div>
                <h4
                    className="t-body-2"
                    style={{ marginBottom: "5px" }}
                >
                    Available on
                </h4>
                { providers }
            </div>
        );
    },
});
