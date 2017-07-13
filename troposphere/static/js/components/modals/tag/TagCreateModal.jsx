import React from "react";
import RaisedButton from "material-ui/RaisedButton";

import stores from "stores";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";

export default React.createClass({
    displayName: "TagCreateModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        name: React.PropTypes.string
    },

    getInitialState: function() {
        // state.name will only be props.name initially, this is intentional
        // because we are using to it to set the initial default
        return {
            name: this.props.name || "",
            description: ""
        };
    },

    componentDidMount: function() {
        stores.TagStore.addChangeListener(this.updateState);
    },

    componentWillUnmount() {
        stores.TagStore.removeChangeListener(this.updateState);
    },

    updateState: function() {
        if (this.isMounted()) {
            this.forceUpdate();
        }
    },

    onCancel: function() {
        this.hide();
    },

    onConfirm: function() {
        let { name, description } = this.state;
        this.hide();
        this.props.onConfirm(name.trim(), description.trim());
    },

    onNameChange: function(e) {
        var newName = e.target.value;
        this.setState({
            name: newName
        });
    },

    onDescriptionChange: function(e) {
        var newDescription = e.target.value;
        this.setState({
            description: newDescription
        });
    },

    renderFooterWarning: function() {
        return (
        <p className="text-danger">
            Tag can not be created. Please fix errors above.
        </p>
        );
    },

    renderInvalidNameWarning: function() {
        return (
        <p className="no-results text-danger">
            The name must contain only letters, numbers, underscores, and
            hyphens.
        </p>
        );
    },

    renderTagExistsWarning: function() {
        let { name } = this.state;
        return (
        <p className="no-results text-danger">
            {`Tag ${name} already exists.`}
        </p>
        );
    },

    render: function() {
        let { name, description } = this.state;
        let lower = name.toLowerCase();
        let isInvalidName = /[^-_0-9a-z]/.test(lower);
        let tagExistsAlready = stores.TagStore.getAll().some(function(tag) {
            return tag.get("name").toLowerCase() == lower.trim() &&
                   // When a user confirms the modal to add the tag, the modal
                   // fades out. During that fade, the tag store gets updated
                   // optimistically to include the new model. We don't want
                   // to check if the tag exists against itself.
                   !tag.isNew();
        });

        let labelWarning = "";
        if (tagExistsAlready) {
            labelWarning = this.renderTagExistsWarning();
        }

        if (isInvalidName) {
            labelWarning = this.renderInvalidNameWarning();
        }

        let footerWarning = "";
        if (tagExistsAlready || isInvalidName) {
            footerWarning = this.renderFooterWarning();
        }

        let isSubmittable =
            name && // True if length > 0
            description && // True if length > 0
            !tagExistsAlready &&
            !isInvalidName;

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="title-1">Create Tag</h1>
                    </div>
                    <div className="modal-body">
                        <div role="form">
                            <div className="form-group">
                                <label>
                                    Tag Name
                                </label>
                                <input type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={this.onNameChange} />
                                {labelWarning}
                            </div>
                            <div className="form-group">
                                <label>
                                    Tag Description
                                </label>
                                <textarea id="project-description"
                                    type="text"
                                    className="form-control"
                                    rows="7"
                                    value={description}
                                    onChange={this.onDescriptionChange} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {footerWarning}
                        <RaisedButton
                            style={{ marginRight: "10px" }}
                            onTouchTap={this.onCancel}
                            label="Cancel"
                        />
                        <RaisedButton
                            primary
                            onTouchTap={this.onConfirm}
                            disabled={!isSubmittable}
                            label="Create Tag"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
