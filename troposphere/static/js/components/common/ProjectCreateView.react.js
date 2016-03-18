import React from 'react';

export default React.createClass({
    displayName: "ProjectCreateModal",

    getInitialState: function () {
        return {
            projectName: "",
            projectDescription: "",
            showValidation: false
        };
    },

    isSubmittable: function() {
        if (this.state.projectName !== "" && this.state.projectDescription !== "") {
            return true;
        }

        return false;
    },

    cancel: function () {
        this.hide();
    },

    confirm: function () {
        if (this.isSubmittable()) {
            this.props.onConfirm(this.state.projectName.trim(), this.state.projectDescription.trim());
        }
        this.setState({showValidation: true });
    },

    // todo: I don't think there's a reason to update state unless
    // there's a risk of the component being re-rendered by the parent.
    // Should probably verify this behavior, but for now, we play it safe.
    onNameChange: function (e) {
        this.setState({projectName: e.target.value});
    },

    onNameBlur: function() {
        let projectName = this.state.projectName.trim();
        this.setState({projectName});
    },

    onDescriptionChange: function (e) {
        this.setState({projectDescription: e.target.value});
    },

    renderBody: function () {
        let projectName = this.state.projectName;
        let projectDescription = this.state.projectDescription;
        let nameClassNames = "form-group";
        let nameErrorMessage = null;
        let descriptionClassNames = "form-group";
        let descriptionErrorMessage = null;

        if (this.state.showValidation) {
            if (projectName === "") {
                nameClassNames = "form-group has-error";
                nameErrorMessage = "This field is required";
            }

            if (projectDescription === "") {
                descriptionClassNames = "form-group has-error";
                descriptionErrorMessage = "This field is required";
            }
        }

        return (
            <div role='form'>
                <div className={nameClassNames}>
                    <label htmlFor='project-name'>Project Name</label>
                    <input type='text'
                        className='form-control'
                        value={projectName}
                        onChange={this.onNameChange}
                        onBlur= {this.onNameBlur}
                    />
                    <span className="help-block">{ nameErrorMessage }</span>
                </div>

                <div className={descriptionClassNames}>
                    <label htmlFor='project-description'>Description</label>
                    <textarea type='text'
                        className='form-control'
                        rows="7"
                        value={this.state.projectDescription}
                        onChange={this.onDescriptionChange}
                    />
                    <span className="help-block">{ descriptionErrorMessage }</span>
                </div>
            </div>
        );
    },

    render: function () {
        let isSubmittable = true;
        if (this.state.showValidation) {
            if (!this.isSubmittable()) {
                isSubmittable = false
            }
        }
        return (
            <div>
                {this.renderBody()}
                <div className="modal-footer">
                    <button
                        id="cancelCreateProject"
                        type="button"
                        className="btn btn-default"
                        onClick={this.props.cancel}
                    >
                        Cancel
                    </button>
                    <button
                        id="submitCreateProject"
                        type="button"
                        className="btn btn-primary"
                        onClick={this.confirm}
                        disabled={!isSubmittable}
                    >
                        Create
                    </button>
                </div>
            </div>
        );
    }
});
