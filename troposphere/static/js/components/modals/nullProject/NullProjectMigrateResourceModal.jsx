import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import Backbone from "backbone";
import _ from "underscore";

import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import ProjectSelect from "components/common/project/ProjectSelect";
import GroupProjectSelection from "components/modals/migrate_resources/GroupProjectSelection";
import Instance from "models/Instance";
import Volume from "models/Volume";
import stores from "stores";


export default React.createClass({
    displayName: "NullProjectMigrateResourceModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    onProjectCreated(project) {
        //Throw out the groupProjectsMap and re-build from the groups and projects store.
        let state = this.getState();
        state.groupProjectsMap = {};
        this.setState(state);
    },
    pairResourceWithProject(resource, project) {
        let { resourceProjectMap } = this.state;
        //FIXME: This will fail if id == id, this should be UUIDs! set 'get_uuid()' for each resource-model and call that, instead.
        resourceProjectMap[resource.id] = {
            resource,
            project,
        }
        this.setState({
            resourceProjectMap
        });
    },

    isSubmittable: function() {
        // Flatten it to:
        // [ { project, resource } ]
        let { resourceProjectMap } = this.state;
        let flattened = _.values(resourceProjectMap);
        var hasValidProjectMapping = flattened.some(function(project_resource) {
            return project_resource.project != null;
        });

        return hasValidProjectMapping;
    },

    //
    // Mounting & State
    // ----------------
    //

    getInitialState: function() {

        let resourceProjectMap = {};

        this.props.resources.forEach(resource => {
            resourceProjectMap[resource.id] = {
                project: null,
                resource
            }
        });
        var initialState = {
            projects: stores.ProjectStore.getAll(),
            groups: stores.GroupStore.getAll(),
            groupProjectsMap: null,
            resourceProjectMap,
        };

        return initialState;
    },

    getState: function() {
        var state = {
            projects: stores.ProjectStore.getAll(),
            groups: stores.GroupStore.getAll(),
            groupProjectsMap: this.state.groupProjectsMap,
        };
        if(!state.groupProjectsMap && state.groups && state.projects) {
            //Create a group-projects map
            state.groupProjectsMap = {};
            state.groups.forEach(function(group) {
                let group_project_list = state.projects.cfilter(
                    function(project) {
                        if(project.get('owner').uuid == group.get('uuid')) {
                            return true;
                        }
                        return false;
                    });
                state.groupProjectsMap[group.id] = group_project_list;
            });
        }

        return state;
    },

    updateState: function() {
        // TODO / FIXME: this guard using `isMounted` needs
        // to be evaluated and removed
        // @lenards
        // https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
        if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function() {
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.GroupStore.addChangeListener(this.updateState);
        this.updateState();
    },

    componentWillUnmount: function() {
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.GroupStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm() {
        this.hide();
        // instanceProjectMap takes the form of:
        // {
        //     instanceId: { project, instance }
        // }
        let { resourceProjectMap } = this.state;

        // Flatten it to:
        // [ { project, resource } ]
        let flattened = _.values(resourceProjectMap);

        this.props.confirm(flattened);
    },

    //
    // Custom Modal Callbacks
    // ----------------------
    //

    //
    // Render
    // ------
    //

    renderExplanationText: function() {
        var explanationText = "";
        if (this.state.projects.length > 0) {
            explanationText = "In order to interact with your resources (such as suspending instances or attaching " +
                "volumes) you will need to move them into a project.  Please select the project you would " +
                "like to move them into below. You may also create a new project."
        } else {
            explanationText = "In order to interact with your resources (such as suspending instances or attaching " +
                "volumes) you will need to move them into a project. At the moment, you don't have any " +
                "projects, but that's not a problem at all!  We can create your first one right here. " +
                "Please enter a name for your project below."
        }
        return explanationText;
    },

    renderBody: function() {
        if (this.state.projects == null || this.state.groups == null) {

            return (
            <div className="loading"></div>
            );
        }
        return (
        <div role="form">
            <div className="form-group">
                <p>
                    {"Looks like you have some resources that aren't in a project!"}
                </p>
                <p>
                    {this.renderExplanationText()}
                </p>
            </div>
            {this.state.groups.map(this.renderGroupProjectSelection)}
        </div>
        );
    },

    renderGroupProjectSelection: function(group) {
        let projects = this.state.groupProjectsMap[group.id];
        if(! projects) {
            return (<div key={group.id} className="loading"/>);
        }
        return (<GroupProjectSelection
                key={group.id}
                group={group}
                resources={this.props.resources}
                onProjectSelected={this.pairResourceWithProject}
                onProjectCreated={this.onProjectCreated}
                projects={projects} />);
    },
    render: function() {
        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="t-title">Migrate Resources</h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <RaisedButton
                            primary
                            onTouchTap={this.confirm}
                            disabled={!this.isSubmittable()}
                            label="Move resources into project"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
