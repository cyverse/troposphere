import _ from "underscore";
import React from "react";
import Backbone from "backbone";

import DeployScript from "models/Script";
import Glyphicon from "components/common/Glyphicon";
import ModalHelpers from "components/modals/ModalHelpers";
import ResourceDetail from "components/projects/common/ResourceDetail";
import ScriptShowModal from "components/modals/script/ScriptShowModal";

import stores from "stores";


const DeployScripts = React.createClass({
    displayName: "DeployScripts",

    propTypes: {
        scripts: React.PropTypes.array.isRequired
    },

    getInitialState() {
        return {
            scriptModels: null
        };
    },

    componentWillReceiveProps(newProps) {
        this.setState(newProps, this.updateState);
    },

    updateState: function() {
        let { scriptModels, allUserScripts } = this.state;


        if (!scriptModels) {
            allUserScripts = stores.ScriptStore.getAll();
        }

        if (allUserScripts && !scriptModels) {
            // We received data from the store ...
            scriptModels = scriptModels || [];

            // transfer from bare script data to models
            this.props.scripts.forEach((s) => {
                scriptModels.push(allUserScripts.get(s));
            });
        }

        this.setState({
            scriptModels,
            allUserScripts
        });

    },

    componentDidMount: function() {
        stores.ScriptStore.addChangeListener(this.updateState);

        // Prime the data pump, yo
        this.updateState();
    },

    componentWillUnmount: function() {
        stores.ScriptStore.removeChangeListener(this.updateState);
    },


    renderScript(script) {
        let scriptName = script.get("title") || "unknown",
            key = script.get("uuid") || scriptName;

        let showScriptModal = function (scriptInfo) {
            let modalProps = {
                script: scriptInfo
            }

            ModalHelpers.renderModal(
                ScriptShowModal,
                modalProps,
                function() { /* do nothing onSuccess */ }
            );
        };

        return (
            <li key={`li-${key}`}>
                <Glyphicon name="file" />{` `}
                <a key={`anchor-${key}`}
                   onClick={showScriptModal.bind(this, script)}>
                    {scriptName}</a>
            </li>
        );
    },

    render() {
        let { scriptModels } = this.state,
            { scripts: rawScripts } = this.props,
            container = null;

        if (scriptModels && scriptModels.length > 0) {
            container = (
                <ResourceDetail label="Deploy Scripts">
                    <ul  style={{ paddingLeft: 0 }}>
                    {scriptModels.map(this.renderScript)}
                    </ul>
                </ResourceDetail>
            );
        } else if (rawScripts && rawScripts.length > 0) {
            // if there were scripts passed via props,
            // we want to load the full model data, so
            // toss that inline spinner out that ...
            container = (
                <ResourceDetail label="Deploy Scripts">
                    <div className="loading-tiny-inline"></div>
                </ResourceDetail>
            );
        }

        return container;
    }
});

export default DeployScripts;
