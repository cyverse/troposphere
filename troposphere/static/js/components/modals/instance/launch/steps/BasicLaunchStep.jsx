import React from "react";
import _ from "underscore";

import BasicInfoForm from "../components/BasicInfoForm";
import ResourcesForm from "../components/ResourcesForm";
import InstanceLaunchFooter from "../components/InstanceLaunchFooter";

export default React.createClass({
    render: function() {
        let defaults = {
            advancedIsDisabled: false
        };

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
                    <ResourcesForm {...this.props} />
                </div>
            </div>
            <InstanceLaunchFooter {..._.extend(defaults, this.props)} />
        </div>
        );
    }
});
