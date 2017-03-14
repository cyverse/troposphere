import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import Backbone from "backbone";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import ProjectSelect from "components/common/project/ProjectSelect";
import ResourceListItem from "components/modals/migrate_resources/ResourceListItem";
import stores from "stores";

export default React.createClass({
    displayName: "NullProjectMigrateResourceModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    isSubmittable: function() {
        var hasLoaded = this.state.projectId !== -999;
        var hasName = !!this.state.projectName;
        var hasTargetProject = (!!this.state.projectId && this.state.projectId !== -1);

        return hasLoaded || hasName || hasTargetProject;
    },

    //
    // Mounting & State
    // ----------------
    //

    getInitialState: function() {
        var initialState = {
            projectName: "",
            projects: stores.ProjectStore.getAll(),
            projectId: -999
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

    confirm: function() {
        this.hide();
        if (this.state.projectId == -1) {
            //Create new project using name input
            this.props.onConfirm({
                projectName: this.state.projectName
            });
        } else {
            //Move to existing, selected project
            this.props.onConfirm({
                projectId: this.state.projectId,
                projects: this.state.projects
            });
        }

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

    onProjectChange: function(e) {
        var int_str = e.target.value;
        this.setState({
            projectId: parseInt(int_str)
        });
    },

    //
    // Render
    // ------
    //

    renderResource: function(resource) {
        return (
        <ResourceListItem key={resource.id} resource={resource} />
        );
    },

    renderProjectSelectionForm: function() {
        if (this.state.projects.length > 0) {
            return (
            <div className="form-group">
                <ProjectSelect projectId={this.state.projectId}
                    projects={this.state.projects}
                    onChange={this.onProjectChange}
                    showCreate={true} />
            </div>
            );
        }
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
                    {this.props.resources.map(this.renderResource)}
                </ul>
                <p>
                    {this.renderExplanationText()}
                </p>
            </div>
            {this.renderProjectSelectionForm()}
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
