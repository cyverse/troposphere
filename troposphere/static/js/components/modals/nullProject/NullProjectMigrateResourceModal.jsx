import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import Backbone from "backbone";
import _ from "underscore";
import context from "context";

import actions from "actions";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import SelectMenu from "components/common/ui/SelectMenu";
import ResourceSelectMenu from "components/modals/migrate_resources/ResourceSelectMenu";
import subscribe from "utilities/subscribe";
import featureFlags from "utilities/featureFlags";


const NullProjectMigrateResourceModal = React.createClass({
    displayName: "NullProjectMigrateResourceModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    onProjectCreated(project) {
        //FIXME: ensure proper rendering
        return;
    },
    onProjectCreateFailed: function() {
        //FIXME: notification, show error validation=True
        return;
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
        var hasValidProjectMapping = flattened.every(function(project_resource) {
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
            projectName: "",
            groupOwner: null,
            resourceProjectMap,
        };

        return initialState;
    },


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

        this.props.onConfirm(flattened);
    },

    //
    // Custom Modal Callbacks
    // ----------------------
    //

    //
    // Render
    // ------
    //

    renderSharingText: function() {
        if (!featureFlags.hasProjectSharing()) {
            return ;
        }
        let sharingText = "NEW: You can now share your cloud resources with other users based on your assigned groups " +
                " use the 'Visibility' selection below and select a shared project to get started! All resources created before " +
                " this update will only be available in your private project. To start sharing resources, create a shared project and add some new resources "
        return (<p className="alert alert-info" style={{fontWeight: 500}}>
            {sharingText}
        </p>);
    },

    renderExplanationText: function() {
        let { ProjectStore } = this.props.subscriptions;
        let projects = ProjectStore.getAll();

        var explanationText = "";
        if (projects.length > 0) {
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

    renderResourceProjectSelection: function(resource, identities_for_groups) {
        let { ProjectStore } = this.props.subscriptions;

        let selectedIdentityUUID = resource.get('identity').uuid;
        let projects = ProjectStore.getAll().cfilter(p => {
            let group = p.get('owner');
            let identities = identities_for_groups[group.uuid];
            if(!identities) {
                return false;
            }
            let containsIdentity = identities.some(identity => {
                return identity.get('uuid') == selectedIdentityUUID;
            });
            return containsIdentity;
        });
        let resource_project = this.state.resourceProjectMap[resource.id];
        return (
        <ResourceSelectMenu key={resource.id}
                            resource={resource}
                            projects={projects}
                            project={resource_project.project}
                            onProjectSelected={this.pairResourceWithProject}
                            optionName={p => this.resourceOptionName(p)} />
        );
    },
    resourceOptionName: function(project) {
        let projectName = project.get('name');
        if(!featureFlags.hasProjectSharing()) {
            return projectName;
        }
        let {GroupStore} = this.props.subscriptions;
        let groupOwnerId = project.get('owner').id,
            group = GroupStore.get(groupOwnerId),
            current_user = context.profile.get('username'),
            groupLeaders = group.get('leaders'),
            groupUsers = group.get('users');

        let isGroupLeader = groupLeaders.find(user=>user.username == current_user),
            isGroupPrivate = groupUsers.length == 1;
        if(isGroupPrivate) {
            return projectName + " (Private)";
        } else if(isGroupLeader) {
            return projectName + " (Owner)";
        } else {
            return projectName + " (Shared)";
        }

    },
    //renderProjectSelection: function() {

    //    if (!featureFlags.hasProjectSharing()) {
    //        return this.renderResourceSelection();
    //    } else {
    //        return this.renderGroupResourceSelection();
    //    }
    //},
    renderGroupResourceSelection: function() {
        /**
         * Use this method when:
         * - You are _explicitly_ separating IdentityMembership between groups. This
         * will ensure users do not "place their resources in the wrong projects"
         *
         * What this method does:
         * - Retrieve a list of identities for each group
         * - Look at the given identity of a resource
         *   - Determine which "group" should be allowed to place the resource.
         * Where this method does not work:
         * - When two or more groups share an IdentityMembership, this method will prevent someone from actually submitting the form.
         *
         */
        let { GroupStore, IdentityStore } = this.props.subscriptions;
        let groups = GroupStore.getAll();
        let identities_for_groups = {};
        let notReady = false;
        if(!groups) {
            notReady = true;
        }
        groups.forEach(group => {
            let identities_for_group = IdentityStore.getIdentitiesForGroup(group);
            if (!identities_for_group) {
                notReady = true;
                return;
            }
            identities_for_groups[group.id] = identities_for_group;
        });
        if(notReady) {
            return (<div className="loading-tiny-inline-only" />);
        }
        let resourcesByGroup = {}
        this.props.resources.map(function(resource) {
            let selectedIdentityUUID = resource.get('identity').uuid;
            groups.forEach(group => {
                let group_id = group.id;
                let identities = identities_for_groups[group_id];
                if(!identities) {
                    return false;
                }
                let containsIdentity = identities.some(identity => {
                    return identity.get('uuid') == selectedIdentityUUID;
                });
                if(!containsIdentity) {
                    return;
                }
                let resources = resourcesByGroup[group_id] || [];
                resources.push(resource);
                resourcesByGroup[group_id] = resources;
            });
        });
        let that = this;
        let groupBasedSelection =  _.map(Object.keys(resourcesByGroup), function(group_id) {
            let groupResources = resourcesByGroup[group_id];
            let group = GroupStore.get(group_id);
            //FIXME: handle groupstore.get == null? (Shouldn't happen...)
            let users = group.get('users'),
                isPrivate = (users.length == 1),
                visibility = (isPrivate) ? "Private Group" : "Shared Group";
            let resourceSelectionOptions = groupResources.map(function(resource) {
                return that.renderResourceProjectSelection(resource, identities_for_groups);
            });
            return (
            <div key={"group-select-"+group_id}>
                <p>
                    <span style={{fontWeight: 500}}>{visibility}</span>
                    { " " + group.get('name')+":"}
                </p>
                <ul>
                    {resourceSelectionOptions}
                </ul>
            </div>);
        });
        return groupBasedSelection;
    },
    renderResourceSelection: function() {

        /* To render all resources in a single list (Ignore groups) */
        let { GroupStore, IdentityStore } = this.props.subscriptions;
        let groups = GroupStore.getAll();
        let identities_for_groups = {};
        let notReady = false;
        if(!groups) {
            notReady = true;
        }
        groups.forEach(group => {
            let identities_for_group = IdentityStore.getIdentitiesForGroup(group);
            if (!identities_for_group) {
                notReady = true;
                return;
            }
            identities_for_groups[group.id] = identities_for_group;
        });
        if(notReady) {
            return (<div className="loading-tiny-inline-only" />);
        }
        let that = this;
        let resourceSelectionList = this.props.resources.map(function(resource) {
            return that.renderResourceProjectSelection(resource, identities_for_groups);
        });
        return resourceSelectionList;
    },
    isCreateDisabled: function() {
        //Enabled for testing.
        //return false;

        return (this.state.projectName.trim() == "");
    },
    mapGroupOptions: function(group) {
        let name = group.get('name'),
            groupUsers = group.get('users'),
            isPrivate = (groupUsers.length == 1),
            optionName;
        if(isPrivate) {
            optionName = name + " (Private)"
        } else {
            optionName = name + " (Shared)"
        }
        return optionName;
    },
    onGroupChange: function(group) {
        this.setState({
            groupOwner: group,
        });
    },
    onProjectNameChange: function(e) {
        this.setState({
            projectName: e.target.value
        });
    },
    createNewProject: function() {
        let { projectName } = this.state;
        let project_params = {
                name: projectName,
                description: projectName,
                owner: this.state.groupOwner,
            };
        actions.ProjectActions.create(
            project_params, this.onProjectCreated, this.onProjectCreateFailed);
    },
    getMemberNames: function(group) {
        if(!group) {
            return "";
        }
        let user_list = group.get('users'),
            username_list = user_list.map(function(g) {return g.username});

        return username_list.join(", ");
    },
    renderVisibility: function() {
        if (!featureFlags.hasProjectSharing()) {
            return ;
        }
        let { GroupStore } = this.props.subscriptions;
        let groups = GroupStore.getAll();
        let projectTip;
        if (!this.state.groupOwner) {
            projectTip = "Select a Group";
        } else if (this.state.groupOwner.get('users').length == 1) {
            projectTip = "Private Project";
        } else {
            let projectUsernameList = this.getMemberNames(this.state.groupOwner);
            projectTip = "Share this Project with Users: " + projectUsernameList;
        }
        return (<div className="form-group">
                <h4 className="t-body-2 col-md-3">Visibility</h4>
                <SelectMenu current={this.state.groupOwner}
                    placeholder={"Select a Private/Shared Group"}
                    list={groups}
                    optionName={g => this.mapGroupOptions(g)}
                    onSelect={this.onGroupChange} />
                <p className="t-caption" style={{ display: "block" }}>
                   {projectTip}
                </p>
            </div>);
    },
    renderProjectCreationForm: function() {

        return (
        <div >
            <div className="form-group">
            <label>
                {"Create a Project"}
            </label>
            <input type="text"
                className="form-control"
                value={this.state.projectName}
                onChange={this.onProjectNameChange}
                placeholder="Enter project name..." />
            </div>
            {this.renderVisibility()}
            <button className="btn btn-primary" onClick={this.createNewProject} disabled={this.isCreateDisabled()}>{"Create Project"}</button>
        </div>
        )
    },

    renderBody: function() {
        let { GroupStore, ProjectStore } = this.props.subscriptions;
        let groups = GroupStore.getAll(),
            projects = ProjectStore.getAll();
        if (projects == null || groups == null) {

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
                {this.renderSharingText()}
            </div>
            {this.renderResourceSelection()}
            {this.renderProjectCreationForm()}
        </div>
        );
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
                            onTouchTap={this.onConfirm}
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
export default subscribe(NullProjectMigrateResourceModal , ["GroupStore", "ProjectStore", "IdentityStore"]);
