import React from "react";
import Backbone from "backbone";
import _ from "underscore";

import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import ProjectSelect from "components/common/project/ProjectSelect";
import ResourceSelectMenu from "components/modals/migrate_resources/ResourceListItem";
import stores from "stores";
// Change the render of instances to have a selectmenu similar to MigrateResourceModal2
// Refresh page and ensure it looks correct
// Update the action/onConfirm so that the logic works for multiple `resource->project` pairs
// Act on page and ensure it takes
// Test with an empty project
// Verify you can create empty/new projects first? im not sure what to do here. ask for halp.
export default React.createClass({
    displayName: "NullProjectMigrateResourceModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    isSubmittable: function() {
        var hasName = !!this.state.projectName;
        // Flatten it to:
        // [ { project, resource } ]
        let { resourceProjectMap } = this.state;
        let flattened = _.values(resourceProjectMap);
        var hasValidProjectMapping = flattened.some(function(project_resource) {
            return project_resource.project != null;
        });

        return hasValidProjectMapping || hasName;
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
        })
        var initialState = {
            projectName: "",
            projects: stores.ProjectStore.getAll(),
            projectId: -999,
            resourceProjectMap,
        };

        return initialState;
    },

    getState: function() {
        var state = {
            projectName: this.state.projectName,
            projects: stores.ProjectStore.getAll(),
            projectId: this.state.projectId
        };

        if (state.projects && state.projects.length > 0) {
            state.projectId = state.projects.first().id;
        } else if (state.projects != null) {
            state.projectId = -1
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
        // Prime the "state" pump
        // - this is isn't called then projectId is still -999
        //   when a user simplified _clicks_ *move* given the
        //   project shown in the drop-down
        this.updateState();
    },

    componentWillUnmount: function() {
        stores.ProjectStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    onConfirm() {
        this.hide();
        // instanceProjectMap takes the form of:
        // {
        //     instanceId: { project, instance }
        // }
        let { resourceProjectMap } = this.state;

        // Flatten it to:
        // [ { project, resource } ]
        let flattened = _.values(resourceProjectMap);

        this.props.onConfirm(this.state.projectName, flattened);
    },

    //
    // Custom Modal Callbacks
    // ----------------------
    //

    onProjectNameChange: function(e) {
        this.setState({
            projectName: e.target.value
        });
    },

    //
    // Render
    // ------
    //

    renderResourceProjectSelection: function(resource) {
        let resource_project = this.state.resourceProjectMap[resource.id];
        return (
        <ResourceSelectMenu key={resource.id} resource={resource} projects={this.state.projects} project={resource_project.project} onProjectSelected={this.pairResourceWithProject}/>
        );
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

    renderProjectCreationForm: function() {
        // Only render this if the user has requested to create a new project from the dropdown
        // The "new project" option has an id of -1
        if (this.state.projectId === -1) {
            return (
            <div className="form-group">
                <label>
                    Project Name
                </label>
                <input type="text"
                    className="form-control"
                    value={this.state.projectName}
                    onChange={this.onProjectNameChange}
                    placeholder="Enter project name..." />
            </div>
            )
        }
    },

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
        if (this.state.projects == null) {

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
                <ul>
                    {this.props.resources.map(this.renderResourceProjectSelection)}
                </ul>
                <p>
                    {this.renderExplanationText()}
                </p>
            </div>
            {this.renderProjectCreationForm()}
        </div>
        );
    },

    render: function() {
        stores.ProjectStore.getAll();
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
                        <button type="button"
                            className="btn btn-primary"
                            onClick={this.onConfirm}
                            disabled={!this.isSubmittable()}>
                            Move resources into project
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
