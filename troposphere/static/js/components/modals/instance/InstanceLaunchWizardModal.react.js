import React from 'react/addons';
import Backbone from 'backbone';
import _ from 'underscore';
import modals from 'modals';
import stores from 'stores';

import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';

import ImageSelectStep from './launch/steps/ImageSelectStep.react';
import BasicLaunchStep from './launch/steps/BasicLaunchStep.react';

export default React.createClass({
    mixins: [BootstrapModalMixin],
    displayName: "InstanceLaunchWizardModal",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model),
        project: React.PropTypes.instanceOf(Backbone.Model),
        onConfirm: React.PropTypes.func.isRequired,
    },

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
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.ImageVersionStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.ImageVersionStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //
    //

    selectImage: function(arg) {
        console.log(arg);
        this.setState({
            view:'BASIC_VIEW',
            image: arg
        });
    },

    cancel: function() {
        this.hide();
    },

    onCompleted: function(launch_data) {
        this.hide();
        this.props.onConfirm(launch_data);
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
                callBack={this.selectImage}
                cancel = {this.cancel}/>
            );
        },

    renderBasicOptions: function() {
        let identity = stores.IdentityStore.getAll();
        return (
                <BasicLaunchStep 
                    image={this.state.image}
                    project={this.state.project}
                    identity={identity}/>
               );
    },

    renderBody: function() {
        var view = this.state.view;
        switch(view) {
            case "IMAGE_VIEW":
            return this.renderImageSelect()
            case "BASIC_VIEW":
            return this.renderBasicOptions()
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


});
