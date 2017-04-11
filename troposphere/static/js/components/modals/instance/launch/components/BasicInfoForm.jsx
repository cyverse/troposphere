import React from "react";
import ReactDOM from "react-dom";
import Backbone from "backbone";
import SelectMenu from "components/common/ui/SelectMenu";

export default React.createClass({
    propTypes: {
        projectList: React.PropTypes.instanceOf(Backbone.Collection),
        imageVersion: React.PropTypes.instanceOf(Backbone.Model),
        imageVersionList: React.PropTypes.instanceOf(Backbone.Collection),
        project: React.PropTypes.instanceOf(Backbone.Model),
        image: React.PropTypes.instanceOf(Backbone.Model),
        instanceName: React.PropTypes.string,
        onNameChange: React.PropTypes.func,
        onVersionChange: React.PropTypes.func,
        onProjectChange: React.PropTypes.func
    },

    componentDidMount: function() {
        // TODO: Once we have current version of React I believe we ca just do:
        // this.refs.nameInput.select();
        ReactDOM.findDOMNode(this.refs.nameInput).select();
    },

    nameError() {
        const { instanceName } = this.props;

        function invalidName() {
          let regex = /\.(\d)+$/gm;
          return Boolean(instanceName.match(regex));
        }

        function missingName() {
            return !Boolean(instanceName)
        }

        if (invalidName()) return "invalid";
        if (missingName()) return "missing";
    },

    render: function() {
        const { 
            imageVersion,
            project,
            projectList,
            instanceName,
            showValidationErr
        } = this.props;
        let hasErrorClass;
        let errorMessage = null;

        let invalidMessage = `Invalid format, names can not end in a period followed by numbers. For example: "Instance Name.2222"`;

        let requiredMessage = "This field is required";

        if (showValidationErr) {
            switch (this.nameError()) {
                case "invalid": 
                    errorMessage = invalidMessage;
                    hasErrorClass = "has-error";
                    break;
                case "missing":
                    errorMessage = requiredMessage;
                    hasErrorClass = "has-error";
                    break;
            }
        }

        return (
        <form>
            <div className={"form-group " + hasErrorClass }>
                <label htmlFor="instanceName">
                    Instance Name
                </label>
                <input required
                    type="Name"
                    className="form-control"
                    id="instanceName"
                    value={instanceName}
                    ref="nameInput"
                    onChange={this.props.onNameChange}
                    onBlur={this.props.onNameBlur} />
                <span className="help-block">{errorMessage}</span>
            </div>
            <div className="form-group">
                <label htmlFor="imageVersion">
                    Base Image Version
                </label>
                <SelectMenu current={imageVersion}
                    list={this.props.imageVersionList}
                    optionName={item => item.get("name")}
                    onSelect={this.props.onVersionChange} />
            </div>
            <div className="form-group">
                <label htmlFor="project">
                    Project
                </label>
                <SelectMenu current={project}
                    list={projectList}
                    optionName={item => item.get("name")}
                    onSelect={this.props.onProjectChange} />
            </div>
        </form>
        );
    },
});
