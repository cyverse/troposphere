import React from "react";
import Backbone from "backbone";
import _ from "underscore";

import globals from "globals";
import stores from "stores";
import BasicInfoForm from "../components/BasicInfoForm.react";
import ResourcesForm from "../components/ResourcesForm.react";
import ResourcesFormAS from "../components/ResourcesFormAS.react";
import InstanceLaunchFooter from "../components/InstanceLaunchFooter.react";

export default React.createClass({
    render: function() {
        let defaults = {
            advancedIsDisabled: false
        };

        let resourceForm;
        if (globals.USE_ALLOCATION_SOURCES) {
            resourceForm = <ResourcesFormAS {...this.props} />;
        } else {
            resourceForm = <ResourcesForm {...this.props} />;
        }

        return (
        <div>
            <div className="modal-section row">
                <div className="col-md-6">
                    <h3 className="t-title">Basic Info</h3>
                    <hr/>
                    <BasicInfoForm {...this.props}/>
                </div>
                <div className="col-md-6">
                    <h3 className="t-title">Resources</h3>
                    <hr/>
                    { resourceForm }
                </div>
            </div>
            <InstanceLaunchFooter {..._.extend(defaults, this.props)} />
        </div>
        );
    }
});
