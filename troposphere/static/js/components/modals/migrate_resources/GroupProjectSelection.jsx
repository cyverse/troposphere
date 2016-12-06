import React from "react";
import Backbone from "backbone";
import _ from "underscore";

import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import ProjectSelect from "components/common/project/ProjectSelect";
import ResourceSelectMenu from "components/modals/migrate_resources/ResourceSelectMenu";
import Instance from "models/Instance";
import Volume from "models/Volume";
import stores from "stores";
import actions from "actions";


export default React.createClass({
    displayName: "GroupProjectSelection",

    propTypes: {
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onProjectSelected: React.PropTypes.func.isRequired,
        onProjectCreated: React.PropTypes.func.isRequired
    },
    //
    // Mounting & State
    // ----------------
    //

    getInitialState: function() {

        let resourceProjectMap = {};
        let resourceGroupsMap = {};

        this.props.resources.forEach(resource => {
            let limitedGroups = stores.GroupStore.getGroupsForIdentity(resource.get('identity'));
            resourceGroupsMap[resource.id] = limitedGroups;
            resourceProjectMap[resource.id] = {
                project: null,
                resource
            }
        });
        var initialState = {
            projectName: "",
            resourceProjectMap,
            resourceGroupsMap,
        };

        return initialState;
    },

    getState: function() {
        let { projectName, resourceGroupsMap } = this.state;

        this.props.resources.forEach(resource => {
            let limitedGroups = stores.GroupStore.getGroupsForIdentity(resource.get('identity'));
            resourceGroupsMap[resource.id] = limitedGroups;
        });

        var state = {
            resourceGroupsMap,
            projectName,
        };
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
        stores.GroupStore.addChangeListener(this.updateState);
        this.updateState();
    },

    componentWillUnmount: function() {
        stores.GroupStore.removeChangeListener(this.updateState);
    },

    renderResourceProjectSelection: function(group, resource) {
        let resource_project = this.state.resourceProjectMap[resource.id];
        return (
        <ResourceSelectMenu key={resource.id}
	    resource={resource}
	    projects={this.props.projects}
	    project={resource_project.project}
	    onProjectSelected={this.pairResourceWithProject}/>
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
        this.props.onProjectSelected(resource, project);
    },


    onProjectNameChange: function(e) {
        this.setState({
            projectName: e.target.value
        });
    },
    renderProjectCreationForm: function() {
        return (
        <div className="form-group">
            <label>
                {"New Project for Group " + this.props.group.get('name')}
            </label>
            <input type="text"
                className="form-control"
                value={this.state.projectName}
                onChange={this.onProjectNameChange}
                placeholder="Enter project name..." />
            <button className="btn btn-primary" onClick={this.createNewProject} disabled={this.isCreateDisabled()}>Create Project</button>
            {/*FIXME: I need a Submission-button here that will:
                1: Create a new project with group `this.props.group`
                2: add to the list and re-render select-menus in teh group with the new proejct
             */}
        </div>
        )
    },

    isCreateDisabled: function() {
        return (this.state.projectName.trim() == "");
    },
    onProjectCreateFailed: function() {
        return;
    },
    onProjectCreated: function(project) {
        let state = this.getState();
        state.projectName = "";
        this.setState(state);
        this.props.onProjectCreated(project);
    },
    createNewProject: function() {
        let { projectName } = this.state;
        let project_params = {
                name: projectName,
                description: projectName,
                owner: this.props.group,
            };
        actions.ProjectActions.create(
            project_params, this.onProjectCreated, this.onProjectCreateFailed);
    },


    render: function() {
        let { group, resources } = this.props;
        let that = this;

        return (
            <div key={group.id} className="form-group">
                <h3>{group.get('name')}</h3>
                <ul>
                    {resources.map(function(resource) {
                        let groups = that.state.resourceGroupsMap[resource.id];
                        if(groups && groups.some(function(test_group) {
                            return test_group.id == group.id;
                        })) {
                            return that.renderResourceProjectSelection(group, resource);
                        }
                    })}
                </ul>
                {this.renderProjectCreationForm()}
            </div>);
    },
});
