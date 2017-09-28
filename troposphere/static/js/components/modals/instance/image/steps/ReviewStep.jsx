import React from "react";
import RaisedButton from "material-ui/RaisedButton";

export default React.createClass({
    displayName: "ImageWizard-ReviewStep",

    propTypes: {
        imageData: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            hasCheckedLicense: false
        }
    },

    isSubmittable: function() {
        var hasCheckedLicense = !!this.state.hasCheckedLicense;
        return hasCheckedLicense;
    },

    onLicenseChange: function(e) {
        this.setState({
            hasCheckedLicense: e.target.checked
        });
    },

    renderAccessList: function(imageData) {
        if (imageData.visibility === "public") {
            return (
        <div className="form-group">
            <label className="control-label col-sm-3">
                AccessList
            </label>
            <div className="help-block col-sm-9">
                {"[Disabled when visibility is public]"}
            </div>
        </div>
        );
        }

        var patterns = imageData.activeAccessList.map(function(pattern_match) {
            return pattern_match.get("pattern") + "("+ pattern_match.get('type') +")";
        });

        return (
        <div className="form-group">
            <label className="control-label col-sm-3">
                AccessList
            </label>
            <div className="help-block col-sm-9">
                {patterns.length > 0 ? patterns.join(", ") : "[n/a]"}
            </div>
        </div>
        )
    },

    renderUsers: function(imageData) {
        if (imageData.visibility !== "select") return;

        var users = imageData.imageUsers.map(function(user) {
            return user.get("username")
        });

        return (
        <div className="form-group">
            <label className="control-label col-sm-3">
                Users
            </label>
            <div className="help-block col-sm-9">
                {users.length > 0 ? users.join(", ") : "[no users selected]"}
            </div>
        </div>
        )
    },

    renderTags: function(imageData) {
        if (!imageData.imageTags || imageData.imageTags.length === 0) {
            return (
            <div className="form-group">
                <label className="control-label col-sm-3">
                    Tags
                </label>
                <div className="help-block col-sm-9">
                    [no tags selected]
                </div>
            </div>
            )
        }

        var tags = imageData.imageTags.map(function(tag) {
            return tag.get("name")
        });

        return (
        <div className="form-group">
            <label className="control-label col-sm-3">
                Tags
            </label>
            <div className="help-block col-sm-9">
                {tags.join(", ")}
            </div>
        </div>
        )
    },

    renderFilesToExclude: function(imageData) {
        var files_str = imageData.filesToExclude || "";

        if (!files_str) {
            return (
            <div className="form-group">
                <label className="control-label col-sm-3">
                    Files to Exclude
                </label>
                <div className="help-block col-sm-9">
                    [no files selected]
                </div>
            </div>
            )
        }

        var files = files_str.split("\n").map(function(file) {
            return <div>
                       {file}
                   </div>;
        });

        return (
        <div className="form-group">
            <label className="control-label col-sm-3">
                Files to Exclude
            </label>
            <div className="help-block col-sm-9">
                {files}
            </div>
        </div>
        )
    },

    renderBootScripts: function(imageData) {
        var scripts = imageData.activeScripts;
        if (!scripts || scripts.length == 0) {
            return (
            <div className="form-group">
                <label className="control-label col-sm-3">
                    Boot Scripts
                </label>
                <div className="help-block col-sm-9">
                    [no scripts selected]
                </div>
            </div>
            )
        }

        var scripts_list = scripts.map(function(script) {
            return <div key={script.id}>
                       {script.get("title")}
                   </div>;
        });

        return (
        <div className="form-group">
            <label className="control-label col-sm-3">
                Boot Scripts
            </label>
            <div className="help-block col-sm-9">
                {scripts_list}
            </div>
        </div>
        )
    },

    renderLicenses: function(imageData) {
        var licenses = imageData.activeLicenses;

        if (!licenses || licenses.length == 0) {
            return (
            <div className="form-group">
                <label className="control-label col-sm-3">
                    Licenses
                </label>
                <div className="help-block col-sm-9">
                    [no licenses selected]
                </div>
            </div>
            )
        }

        var licenses_list = licenses.map(function(license) {
            return <div key={license.id}>
                       {license.get("title")}
                   </div>;
        });

        return (
        <div className="form-group">
            <label className="control-label col-sm-3">
                Licenses
            </label>
            <div className="help-block col-sm-9">
                {licenses_list}
            </div>
        </div>
        )
    },

    renderBody: function(imageData) {
        var visibilityMap = {
            "public": "Public (everyone can see the image)",
            "private": "Private (only you can see the image)",
            "select": "Select Users (only you and selected users can see the image)"
        };

        return (
        <div className="image-request-summary">
            <p>
                {"An image request will be submitted with the following information:"}
            </p>
            <div className="form-horizontal">
                <div className="form-group">
                    <label className="control-label col-sm-3">
                        New/Update
                    </label>
                    <div className="help-block col-sm-9">
                        {(imageData.newImage) ? "New Image" : "Update Image"}
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label col-sm-3">
                        Name
                    </label>
                    <div className="help-block col-sm-9">
                        {imageData.name}
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label col-sm-3">
                        Description
                    </label>
                    <div className="help-block col-sm-9">
                        {imageData.description}
                    </div>
                </div>
                {this.renderTags(imageData)}
                <hr/>
                <div className="form-group">
                    <label className="control-label col-sm-3">
                        Version Name
                    </label>
                    <div className="help-block col-sm-9">
                        {imageData.versionName}
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label col-sm-3">
                        Version Changes
                    </label>
                    <div className="help-block col-sm-9">
                        {imageData.versionChanges}
                    </div>
                </div>
                <hr/>
                <div className="form-group">
                    <label className="control-label col-sm-3">
                        Visibility
                    </label>
                    <div className="help-block col-sm-9">
                        {visibilityMap[imageData.visibility]}
                    </div>
                </div>
                {this.renderAccessList(imageData)}
                {this.renderUsers(imageData)}
                {this.renderFilesToExclude(imageData)}
                {this.renderBootScripts(imageData)}
                {this.renderLicenses(imageData)}
            </div>
            <div className="form-group">
                <div className="checkbox">
                    <label className="checkbox">
                        <input type="checkbox" onChange={this.onLicenseChange} /> I certify that this image does not contain license-restricted software that is prohibited from being distributed within a virtual or cloud environment.
                    </label>
                </div>
            </div>
        </div>
        );
    },

    render: function() {
        var imageData = this.props.imageData;

        return (
        <div>
            <div className="modal-body">
                {this.renderBody(imageData)}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-default cancel-button pull-left" onClick={this.props.onPrevious}>
                    <span className="glyphicon glyphicon-chevron-left"></span> Back
                </button>
                <RaisedButton
                    primary 
                    onTouchTap={this.props.onNext}
                    disabled={!this.isSubmittable()}
                    label="Request Image"
                />
            </div>
        </div>
        );
    }
});
