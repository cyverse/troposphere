import React from 'react';
import stores from 'stores';
import $ from 'jquery';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';


export default React.createClass({
    displayName: "ExternalLinkCreateModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        initialExternalLinkName: React.PropTypes.string,
        project: React.PropTypes.instanceOf(Backbone.Model)
    },

    //
    // Mounting & State
    // ----------------
    //

    getInitialState: function () {
        return {
            name: this.props.initialExternalLinkName,
            description: "",
            link: "",
            shouldValidate: false
        }
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function () {
        this.hide();
    },

    confirm: function () {
        if (!this.isSubmittable()) {
            this.setState({
                shouldValidate: true
            }); return
        }
        this.hide();
        this.props.onConfirm(
            $.trim(this.state.name),
            this.state.description,
            this.state.link
        );
    },

    //
    // Custom Modal Callbacks
    //

    onNameChange: function (e) {
        let newName = e.target.value;
        this.setState({name: newName});
    },

    onLinkChange: function (e) {
        let newLink = e.target.value;
        this.setState({link: newLink});
    },

    onDescriptionChange: function (e) {
        let newDescription = e.target.value;
        this.setState({description: newDescription});
    },

    //
    // Modal Validation
    // ------------------
    //

    validateTitle: function() {
        let title = this.state.name;
        if (!title.length) {
            return {
                valid: false,
                cause: "empty"
            }
        }
        if (title) {
            let lower = $.trim(title.toLowerCase());
            let project = this.props.project;
            let externalLinks = stores.ProjectExternalLinkStore.getAll()
            .filter(function (projectExternalLink) {
                if(project && project.id === projectExternalLink.get('project').id) {
                    return projectExternalLink.get('external_link')
                        .title.toLowerCase() === lower;
                } else {
                    // If no project is given, do not validate the title.
                    return false;
                }
            });

            if (externalLinks.length > 0) {
                return {
                    valid: false,
                    cause: "duplicate"
                }
            }
        }
        return {
            valid: true,
            cause: ""
        }
    },

    validateLink: function() {
        let link = this.state.link;
        let validLink = (link.search("https?://") !== -1);
        if (!link.length) {
            return {
                valid: false,
                cause: "empty"
            }
        }
        if (!validLink) {
            return {
                valid: false,
                cause: "notURL"
            }
        }
        return {
            valid: true,
            cause: ""
        }
    },

    isSubmittable: function() {
        let title = this.validateTitle().valid;
        let description = !!this.state.description;
        let link = this.validateLink().valid;
        return title && description && link;
    },

    errorMessages: function() {
        // Title Messages
        let title = this.validateTitle;
        let titleMessage;
        if (!title().valid) {
            if (title().cause === "empty") {
                titleMessage = "Link must have a title";
            }
            if (title().cause === "duplicate") {
                titleMessage = "Link with name \"" + this.state.name + "\" already exists in this project.";
            }
        }

        // Description messages
        let description = this.state.description;
        let descriptionMessage;
        if (!description) {
            descriptionMessage = "Link must have a description";
        }

        // Link Messages
        let link = this.validateLink;
        let linkMessage;
        if (!link().valid) {
            if (link().cause === "empty") {
                linkMessage = "Link must have a URL";
            }
            if (link().cause === "notURL") {
                linkMessage = "Link URL must start with http(s)://";
            }
        }
        return {
            titleMessage,
            descriptionMessage,
            linkMessage
        }
    },

    //
    // Render
    // ------
    //

    renderBody: function () {
        let formattedTitleError;
        let formattedDescriptionError;
        let formattedLinkError;
        if (!this.isSubmittable() && this.state.shouldValidate) {
            formattedTitleError = (
                <p className="no-results text-danger">
                    {this.errorMessages().titleMessage}
                </p>
            );

            formattedDescriptionError = (
                <p className="no-results text-danger">
                    {this.errorMessages().descriptionMessage}
                </p>
            );

            formattedLinkError = (
                <p className="no-results text-danger">
                    {this.errorMessages().linkMessage}
                </p>
            );
        }
        let requiredLabel = ( <span style={{color: "red"}}>*</span> );

        return (
            <div className="clearfix" style={{marginBottom: "50px"}} role='form'>
            <div className='form-group'>
                <label htmlFor='linkName'>
                    Link Title {requiredLabel}
                </label>
                <input
                    type="text"
                    className="form-control"
                    value={this.state.name}
                    onChange={this.onNameChange}
                />
                {formattedTitleError}
            </div>

            <div className='form-group'>
                <label htmlFor='linkSize'>
                    Link Description {requiredLabel}
                </label>
                <textarea
                    id='project-description'
                    type='text'
                    className='form-control'
                    rows="7"
                    value={this.state.description}
                    onChange={this.onDescriptionChange}
                />
                {formattedDescriptionError}
            </div>

            <div className='form-group'>
                <label htmlFor='linkName'>
                    Link URL {requiredLabel}
                </label>
                <input
                    type="text"
                    className="form-control"
                    value={this.state.link}
                    onChange={this.onLinkChange}
                />
                {formattedLinkError}
            </div>

              <div style={{float: "right"}}>
                {requiredLabel} Required
              </div>
            </div>
        );
    },

    render: function () {
        let footerErrorText;

        if (!this.isSubmittable() && this.state.shouldValidate){
            footerErrorText = (
                <p className="text-danger">
                    ExternalLink can not be created. Please fix the error(s) above.
                </p>
            );
        }

        let isDisabled = false;
        if (this.state.shouldValidate) {
            if (!this.isSubmittable()) {
                isDisabled = true;
            }
        }
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <h2 className="t-headline">
                                Create a Link
                            </h2>
                        </div>
                        <div className="modal-body">
                            {this.renderBody()}
                        </div>
                        <div className="modal-footer">
                            {footerErrorText}
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={this.cancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.confirm}
                                disabled={isDisabled}
                            >
                                Create Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
