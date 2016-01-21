import React from 'react';
import Backbone from 'backbone';
import _ from 'underscore';
import stores from 'stores';
import BasicInfoForm from '../components/BasicInfoForm.react';
import ResourcesForm from '../components/ResourcesForm.react';
import InstanceLaunchFooter from '../components/InstanceLaunchFooter.react';

export default React.createClass({

    render: function () {
        return (
            <div>
                <div className="modal-section row">
                    <div className="col-md-6">
                        <h3 className="t-title">Basic Info</h3>
                        <hr/>
                        { React.createElement(BasicInfoForm, this.props) }
                    </div>
                    <div className="col-md-6">
                        <h3 className="t-title">Resources</h3>
                        <hr/>
                        { React.createElement(ResourcesForm, this.props) }
                </div>
                </div>
                { React.createElement(InstanceLaunchFooter, _.extend({backIsDisabled: false}, this.props)) }
            </div>
        );
    }
});
