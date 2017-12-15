import React from "react";

import QuotaView from "components/admin/ResourceRequest/QuotaView";
import cancellable from "utilities/cancellable";

export default React.createClass({

    propTypes: {
        identity: React.PropTypes.object.isRequired,
        onSave: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            identity: this.props.identity.clone(),
            isPending: false,
            cancellables: [],
        }
    },

    onSave() {
        let { identity, cancellables } = this.state;

        // Create cancellable versions of callbacks to prevent calling
        // setState on unmount
        let onSuccess = cancellable(
            ident => {
                identity.set(ident);
                this.setState({ identity, isPending: false });
            }
        )
        let onErr = cancellable(() => this.setState({ isPending: false }))
        cancellables.push(onSuccess);
        cancellables.push(onErr);

        this.setState({ isPending: true });

        // Clone our identity, so that call to props.onSave doesn't affect our
        // state
        this.props.onSave(identity.clone())
            .then(onSuccess, onErr);
    },

    componentWillUnmount() {
        this.state.cancellables.forEach(c => c.cancel());
    },

    onQuotaChange(quota) {
        let { identity } = this.state;

        identity.set("quota", quota);
        this.setState({ identity });
    },

    render() {
        let { identity: cloudIdentity } = this.props;
        let { identity, isPending } = this.state;
        let { onQuotaChange } = this;
        let localQuota = identity.get("quota");
        let cloudQuota = cloudIdentity.get("quota");

        let quotaChanged =
            // Check if the the cloud identity and local identity for different quota
            Object.keys(cloudQuota).some(attr => cloudQuota[attr] !== localQuota[attr]);

        let statusElement = null;
        if (isPending) {
            statusElement = <span style={{ float: "right", margin: 0 }} className="loading-small"></span>;
        } else if (quotaChanged) {
            statusElement = <span> <a style={{ float: "right" }} onClick={ this.onSave }>save</a></span>;
        }

        return (
        <div style={{ marginBottom: "10px" }}>
            <p>{ identity.get("provider").name }{ statusElement }</p>
            <QuotaView {...{ quota: localQuota, onQuotaChange }} />
        </div>
        );
    }
});
