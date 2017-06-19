import React from "react";
import Backbone from "backbone";
import _ from "underscore";

import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import stores from "stores";
import globals from "globals";
import SelectMenu from "components/common/ui/SelectMenu";
import InstanceActions from "actions/InstanceActions";

const DefaultModalView = React.createClass({
    displayName: "NoAllocationSourceDefaultModalView",

    propTypes: {
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        allocationSources: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onConfirm: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return this.getStateFromProps(this.props);
    },

    componentWillReceiveProps(props) {
        this.setState(this.getStateFromProps(props));
    },

    getStateFromProps(props) {
        let { allocationSources, instances } = this.props;

        // This is a structure for the pairing of (instance, allocationSource)
        // Ex. { instance.id:  { instance, allocationSource }}
        let instanceAllocations = {};
        let defaultAllocation = allocationSources.first();

        // Create a default pairing for each instance
        instances.forEach(instance => {
            instanceAllocations[instance.id] = {
                allocationSource: defaultAllocation,
                instance
            }
        })

        return {
            instanceAllocations
        }
    },

    onConfirm() {
        // instanceAllocations takes the form of:
        // {
        //     instanceId: { allocationSource, instance }
        // }
        let { instanceAllocations } = this.state;

        // Flatten it to:
        // [ { allocationSource, instance } ]
        let flattened = _.values(instanceAllocations);

        this.props.onConfirm(flattened);
    },

    renderInstance(instance) {
        let { allocationSources } = this.props;
        let { allocationSource } = this.state.instanceAllocations[instance.id];

        return (
        <li key={instance.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0px 0px 10px 10px" }}>
            <b style={{ whiteSpace: "nowrap" }}>{instance.get("name")}</b>
            <span style={{ width: "40%" }}><SelectMenu current={allocationSource}
                                                 list={allocationSources}
                                                 onSelect={as => this.pairInstanceWithAllocation(instance, as)}
                                                 optionName={as => as.get("name")} /></span>
        </li>
        )
    },

    pairInstanceWithAllocation(instance, allocationSource) {
        let { instanceAllocations } = this.state;
        instanceAllocations[instance.id] = {
            instance,
            allocationSource
        }
        this.setState({
            instanceAllocations
        });
    },

    renderProject(project, orphans) {
        let name = project.get("name");
        let renderedInstances = orphans.map(this.renderInstance);

        return (
        <div key={name}>
            <h2 className="t-title">{`Project: ${name}`}</h2>
            <ul style={{ padding: 0 }}>
                {renderedInstances}
            </ul>
        </div>
        )
    },

    renderProjectList(renderedProjects, project) {
        let orphans = this.props.instances;
        let projectInstances = project.get("instances");

        // Get project instances that are orphans (missing an
        // allocationSource)
        let projectOrphans = orphans.filter(
            a => projectInstances.some(b => a.id == b.id)
        );

        // If the project has orphan instances, render that project
        if (projectOrphans.length > 0) {
            renderedProjects.push(this.renderProject(project, projectOrphans));
        }

        return renderedProjects;
    },

    renderNullProjectInstances() {
        let orphans = this.props.instances,
            renderedNullProject = [];

        let noProjects = orphans.filter(
            o => o.get("project") == null
        );

        if (noProjects.length > 0) {
            let pseudoProject = new Backbone.Model({
                name: "<None>"
            });
            renderedNullProject.push(
                this.renderProject(pseudoProject, noProjects));
        }

        return renderedNullProject;
    },

    renderBody() {
        let { projects } = this.props;

        // Render each project that needs updated instances
        let renderedProjects = projects.reduce(this.renderProjectList, []);
        let renderedNullProject = this.renderNullProjectInstances();

        return (
        <div role="form">
            <p>
                It looks like you have instances without an Allocation Source. When an instance is active it will use up allocation from its Allocation Source.
            </p>
            <p>
                Review that these are okay.
            </p>
            <hr className="hr" />
            {renderedProjects}
            {renderedNullProject}
        </div>
        );
    },

    render() {
        return (
        <div className="modal-content">
            <div className="modal-header">
                <h1 className="t-title">Confirm Allocation Sources for Your Instances</h1>
            </div>
            <div className="modal-body">
                {this.renderBody()}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={this.onConfirm}>
                    Confirm Selections
                </button>
            </div>
        </div>
        );
    }
});

const LoadingModalView = React.createClass({
    displayName: "NoAllocationSourceLoadingModalView",

    render() {

        let containerStyle = {
            position: "absolute",
            width: "100%",
            display: "flex",
            top: "0",
            left: "0",
            bottom: "0",
            alignItems: "center"
        };

        return (
        <div className="modal-content">
            <div style={{ position: "relative" }} className="modal-body">
                <div style={containerStyle}>
                    <div className="loading"></div>
                </div>
            </div>
        </div>
        );
    }
})

const ModalBackend = React.createClass({
    displayName: "NoAllocationSourceModalBackend",

    mixins: [BootstrapModalMixin],

    propTypes: {
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onConfirm: React.PropTypes.func.isRequired
    },

    componentDidMount() {
        stores.ProjectStore.addChangeListener(this.updateState);

        if (globals.USE_ALLOCATION_SOURCES) {
            stores.AllocationSourceStore.addChangeListener(this.updateState);
        }

        this.updateState();
    },

    onConfirm(pairs) {
        // Pairs represent the pairing of an instance to an allocation source
        // pairs = [{ instance, allocationSource }, ...]
        pairs.forEach(InstanceActions.updateAllocationSource);

        this.hide();
        this.props.onConfirm();
    },

    componentWillUnmount() {
        stores.ProjectStore.removeChangeListener(this.updateState);

        if (globals.USE_ALLOCATION_SOURCES) {
            stores.AllocationSourceStore.removeChangeListener(this.updateState);
        }

    },

    updateState() {
        this.forceUpdate();
    },

    render() {
        let projects = stores.ProjectStore.getAll();
        let allocationSources = stores.AllocationSourceStore.getAll();
        let loading = !(projects && allocationSources);

        let props = {
            allocationSources,
            projects,
            instances: this.props.instances,
            onConfirm: this.onConfirm
        }

        let body = loading
            ? <LoadingModalView />
            : <DefaultModalView { ...props } />

        if (allocationSources && allocationSources.length == 0) {
            // we've entered an edge case, they have a valid
            // account - but that account does not appear to
            // have any allocationSources - redirect to a
            // a templated error view/page
            window.location = "/allocations";
        }

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                {body}
            </div>
        </div>
        );
    }
});

export { ModalBackend as default };
export { LoadingModalView, DefaultModalView };
