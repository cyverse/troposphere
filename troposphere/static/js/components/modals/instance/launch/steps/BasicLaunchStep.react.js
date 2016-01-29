import React from 'react';
import Backbone from 'backbone';
import _ from 'underscore';
import stores from 'stores';
import BasicInfoForm from '../components/BasicInfoForm.react';
import ResourcesForm from '../components/ResourcesForm.react';
import InstanceLaunchFooter from '../components/InstanceLaunchFooter.react';

export default React.createClass({
    canLaunch: function() {
        var requiredFields = ["project", "identityProvider", "providerSize", "imageVersion", "attachedScripts"];
        var notFalsy = ((prop) => Boolean(this.props[prop]) != false);

        // instanceName will be null, indicating that it has not been set.
        // If instanceName equals the empty string, the user has erased the
        // name, and is trying to launch an instance with no name.
        return _.every(requiredFields, notFalsy) && this.props.instanceName !== "";
    },
    render: function () {
        var defaults = { advancedIsDisabled: false, launchIsDisabled: !this.canLaunch() };
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
                        <ResourcesForm {...this.props}/>
                </div>
                </div>
                <InstanceLaunchFooter {..._.extend(defaults, this.props)} />
            </div>
        );
    }
});
