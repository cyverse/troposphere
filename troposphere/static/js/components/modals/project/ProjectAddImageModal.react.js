import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import ProjectSelect from '../instance_launch/ProjectSelect.react';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';


export default React.createClass({
    displayName: 'ProjectAddImageModal',

    mixins: [BootstrapModalMixin],

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
    },
    selectFirstAvailable: function(projects, existing_projects) {
        let firstProjectID = 0;
        if (projects == null || existing_projects == null) {
            return firstProjectID;
        }
        projects.forEach(function(project) {
            let project_id = project.id;
            let project_match = existing_projects.filter(function(existing_project) {
                let test_project_id = existing_project.get('project').id;
                return (test_project_id == project_id)
            });
            if (firstProjectID !== 0) {
                return;
            }
            if (project_match.length === 0) {
                firstProjectID = project_match.id;
            }
        });
        return firstProjectID;
    },
    getInitialState: function() {
        //Note: This should be available already. But we have a 'fallback' in render()
        let projectId,
            projects = stores.ProjectStore.getAll(),
            existing_projects = stores.ProjectImageStore.getProjectsFor(
                this.props.image.id);

        if (projects != null && projects.length > 0) {
            projectId = this.selectFirstAvailable(projects, existing_projects)
        } else {
            projectId = 0;
        }
        return {
            projectId: projectId,
            projects: projects,
            existing: existing_projects,
        }
    },
    updateState: function() {
        let updatedState = {};
        if (this.state.projects == null) {
            let projects = stores.ProjectStore.getAll();
            updatedState.projects = projects;
        }
        if (this.state.existing == null) {
            let existing = stores.ProjectImageStore.getProjectsFor(
                this.props.image.id);
            updatedState.existing = existing;
        }
        this.setState(updatedState);
    },

    isSubmittable: function() {
        let projects = this.filterRemainingProjects();
        let hasProject = !!this.state.projectId && projects.length > 0;
        return hasProject;
    },

    //
    // Mounting & State
    // ----------------
    //

    componentDidMount: function() {
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.ProjectImageStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.ProjectImageStore.removeChangeListener(this.updateState);
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
        var project = this.state.projects.get(this.state.projectId);
        //Action to add 'image' to 'project' happens in 'props.onConfirm'
        this.props.onConfirm(project, this.props.image);
    },


    //
    // Custom Modal Callbacks
    // ----------------------
    //

    onProjectChange: function(e) {
        var newProjectId = parseInt(e.target.value); //Remove parseInt when we use UUIDs here.
        this.setState({
            projectId: newProjectId
        });
    },


    //
    // Render
    // ------
    //

    renderImage: function() {
        return (
        <p>
            { this.props.image.get('name') }
        </p>
        );
    },
    renderExistingProjects: function() {
        if (this.state.existing == null) {
            return (<div className='loading' />);
        }
        let project_divs = this.state.existing.map(function(existing_project) {
            return (
            <div id={ existing_project.cid }>
                { existing_project.get('project').name }
            </div>
            );
        });

        return (
        <div className='form-group'>
            <label htmlFor='existing-project'>
                Added to Project(s)
            </label>
            <div id='existing-project'>
                { project_divs }
            </div>
        </div>
        );
    },
    filterRemainingProjects: function() {
        if (this.state.projects == null || this.state.existing == null) {
            return [];
        }
        var self = this;
        var project_arr = this.state.projects.filter(function(project) {
            let needle = project.id;
            let haystack_matches = self.state.existing.filter(
                function(existing_project) {
                    let project_id = existing_project.get('project').id;
                    return project_id == needle;
                });
            return haystack_matches.length == 0;
        });
        let projects = new Backbone.Collection(project_arr);
        return projects;
    },
    renderProjects: function() {
        if (this.state.projects == null || this.state.existing == null) {
            return (<div className='loading' />);
        }
        let projects = this.filterRemainingProjects();
        if (projects.length == 0) {
            //NOTE: This could be better achieved by handling the 'empty case' (Exception message)
            //separately from the 'null case' (loading)..
            //Because the component re-used was not in 'common' I will leave this as an exercise
            //for the reader.
            return (
            <div className='form-group'>
                <label htmlFor='project'>
                    Project
                </label>
                <select className='form-control' id='project'>
                    <option value="-1">
                        No Project Available.
                    </option>
                </select>
            </div>
            );
        } else if (this.state.projectId == 0) {
            //Zero represents a value that has not yet been set.
            //BUG!
            this.state.projectId = projects.first().id;
        }

        return (
        <div className='form-group'>
            <label htmlFor='project'>
                Project
            </label>
            <ProjectSelect projectId={ this.state.projectId } projects={ projects } onChange={ this.onProjectChange } />
        </div>
        );
    },
    renderBody: function() {
        return (
        <div role='form'>
            <div className='form-group'>
                <label htmlFor='addImage'>
                    Add Image to Project
                </label>
                <p>
                    Select a project to add the image:
                </p>
                <ul>
                    { this.renderImage() }
                </ul>
            </div>
            { this.renderProjects() }
            { this.renderExistingProjects() }
        </div>
        );
    },

    render: function() {
        // todo: If the user only has one project, provide an action to create another project

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        { this.renderCloseButton() }
                        <strong>Add Image to Project</strong>
                    </div>
                    <div className="modal-body">
                        { this.renderBody() }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={ this.cancel }>
                            Cancel
                        </button>
                        <button type="button"
                                className="btn btn-primary"
                                onClick={ this.confirm }
                                disabled={ !this.isSubmittable() }>
                            Add image to project
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
