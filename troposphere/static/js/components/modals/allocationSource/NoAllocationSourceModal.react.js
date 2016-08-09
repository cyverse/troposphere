import React from 'react';
import Backbone from 'backbone';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';
import stores from 'stores';

import SelectMenu from 'components/common/ui/SelectMenu2.react';

function getProjectState() {
    return {
        projectList: stores.ProjectStore.getAll()
    };
}

export default React.createClass({
    displayName: "NoAllocationSourceModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        instances: React.PropTypes.array.isRequired
    },

    //
    // Mounting & State
    // ----------------
    //
    getInitialState: function() {
        return getProjectState();
    },

    updateProjects: function() {
        if (this.isMounted()) this.setState(getProjectState());
    },

    componentDidMount: function() {
        stores.ProjectStore.addChangeListener(this.updateProjects);
    },

    componentWillUnmount: function() {
        stores.ProjectStore.removeChangeListener(this.updateProjects);
    },
 
    // Internal Modal Callbacks
    // ------------------------
    //

    confirm: function () {
        // NOTE: onConfirm could launch a modal, so hide first.
        this.hide();
        this.props.onConfirm();
    },

    renderInstanceList: function (project) {
        return this.props.instances.map((instance, index) => {

            if (true) {
                return (
                    <li style={{
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "space-between",
                            padding: "0px 0px 10px 10px",
                        }}
                    >
                        <b style={{whiteSpace: "nowrap"}}>
                            { instance.get('name') }
                        </b>
                        <span style={{width: "40%", float: "right"}}>
                            <SelectMenu/>
                        </span>
                    </li>
                )
            }
        });
    },
    
    renderProjectList: function(project) {
        if (project.get('instances').length > 0) {
            return (
                <div>
                    <h2 className="t-title">{ `${project.get('name')} Project` }</h2>
                    <hr className="hr" />
                    <ul style={{padding: 0}}>
                        { this.renderInstanceList(project) }
                    </ul>
                </div>
            )
        }
    },

    renderBody: function () {
        let projectList = () => {
            let list = this.state.projectList;
            if (list) return list.map(this.renderProjectList);

            return "Loading..."
        };

        return (
            <div role='form'>
                <p>
                    {"Looks like you have some instances without an Allocation Source. Below we have assigned them for you. Please review and make any changes you'd like. When you are finished confirm to continue your work."}
                </p>          
                { projectList() }

            </div>
        );
    },

    render: function () {
        var projects = stores.ProjectStore.getAll();
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="t-headline">Select Allocation Sources for Your Instances</h1>
                        </div>
                        <div className="modal-body">
                            {this.renderBody()}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.confirm}>
                                Confirm Selections
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
