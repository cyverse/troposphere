import React from 'react';

export default React.createClass({
    displayName: "ProjectCreateModal",

    getInitialState: function () {
        return {
            projectName: "",
            projectDescription: ""
        };
    },

    isSubmittable: function(){
        var hasName = !!this.state.projectName.trim();
        var hasDescription = !!this.state.projectDescription.trim();
        return hasName && hasDescription;
    },

    cancel: function () {
        this.hide();
    },

    confirm: function () {
        this.props.onConfirm(this.state.projectName, this.state.projectDescription);
    },

    // todo: I don't think there's a reason to update state unless
    // there's a risk of the component being re-rendered by the parent.
    // Should probably verify this behavior, but for now, we play it safe.
    onNameChange: function (e) {
        this.setState({projectName: e.target.value});
    },

    onDescriptionChange: function (e) {
        this.setState({projectDescription: e.target.value});
    },

    renderBody: function () {
        return (
            <div role='form'>
                <div className='form-group'>
                    <label htmlFor='project-name'>Project Name</label>
                    <input type='text' className='form-control' value={this.state.projectName} onChange={this.onNameChange}/>
                </div>

                <div className='form-group'>
                    <label htmlFor='project-description'>Description</label>
                    <textarea type='text'
                        className='form-control'
                        rows="7"
                        value={this.state.projectDescription}
                        onChange={this.onDescriptionChange}
                    />
                </div>
            </div>
        );
    },

    render: function () {

        return (
            <div>
                {this.renderBody()}
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={this.props.cancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.confirm}
                            disabled={!this.isSubmittable()}
                    >
                        Create
                    </button>
                </div>
            </div>
        );
    }
});
