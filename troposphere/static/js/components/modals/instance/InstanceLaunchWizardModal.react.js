import React from 'react/addons';
import Backbone from 'backbone';
import _ from 'underscore';
import modals from 'modals';
import stores from 'stores';

import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';
import BreadcrumbNav from 'components/common/breadcrumb/BreadcrumbNav.react';

import ImageSelectStep from './launch/steps/ImageSelectStep.react';
import NameIdentityVersionStep from './launch/steps/NameIdentityVersionStep.react';
import SizeSelectStep from './launch/steps/SizeSelectStep.react';
import ProjectSelectStep from './launch/steps/ProjectSelectStep.react';
import UserOptionsStep from './launch/steps/UserOptionsStep.react';
import AdministratorOptionsStep from './launch/steps/AdminOptionsStep.react';
import LicensingStep from './launch/steps/LicensingStep.react';
import ReviewLaunchStep from './launch/steps/ReviewLaunchStep.react';

export default React.createClass({
    mixins: [BootstrapModalMixin],
    displayName: "InstanceLaunchWizardModal",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model),
        project: React.PropTypes.instanceOf(Backbone.Model),
        onConfirm: React.PropTypes.func.isRequired,
    },

    onRequestResources: function(){
        // Launching a resource request modal will eat the current modal. We need to pass this.cancel as a prop
        // in order to properly unmount the whole modal, not just the current step component.
        this.cancel();
        modals.HelpModals.requestMoreResources();
    },

    renderImageSelect: function() {
        return (
            <ImageSelectStep
                image={this.state.image}
                onPrevious={this.cancel}
                onNext={this.onNext}/>
            );
        },

    renderBody: function() {
        var view = this.state.view;
        switch(view) {
            case "IMAGE_VIEW":
            return this.renderImageSelect();
        }
    },

    render: function() {
        return (
            <div className="modal fade">
                <div className="modal-dialog" style={{width:"100%", maxWidth:"800px"}}>
                    <div className="modal-content">
                        <div className="modal-header instance-launch">
                            {this.renderCloseButton()}
                            <h2 className="headline">Launch an Instance/ {this.state.title}</h2>
                        </div>
                        <div className="modal-body">
                            {this.renderBody()}
                        </div>
                    </div>
                </div>
            </div>
      );
    },

    //
    // Mounting & State
    // ----------------
    //

    getInitialState: function(){
        var image = this.props.image,
            project = this.props.project;
        return {
            image: image,
            project: project,
            title: "Image",
            view: "IMAGE_VIEW"
        };
    },

    getState: function() {
        return this.state;
    },

    updateState: function() {
        if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function() {
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.ProjectVolumeStore.addChangeListener(this.updateState);
        stores.ProjectInstanceStore.addChangeListener(this.updateState);
        stores.InstanceStore.addChangeListener(this.updateState);
        stores.ImageVersionStore.addChangeListener(this.updateState);
        stores.MaintenanceMessageStore.addChangeListener(this.updateState);
        stores.ScriptStore.addChangeListener(this.updateState);
        stores.LicenseStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.ProjectVolumeStore.removeChangeListener(this.updateState);
        stores.ProjectInstanceStore.removeChangeListener(this.updateState);
        stores.InstanceStore.removeChangeListener(this.updateState);
        stores.ImageVersionStore.removeChangeListener(this.updateState);
        stores.MaintenanceMessageStore.removeChangeListener(this.updateState);
        stores.ScriptStore.removeChangeListener(this.updateState);
        stores.LicenseStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    onCompleted: function(launch_data) {
        this.hide();
        this.props.onConfirm(launch_data);
    }

});
