import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import SelectMenu from 'components/common/ui/SelectMenu.react';

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
        React.findDOMNode(this.refs.nameInput).select();
    },

   render: function () {
        let imageVersion = this.props.imageVersion;
        let imageVersionId = imageVersion ? imageVersion.get('id') : null;
        let project = this.props.project;
        let projectId = project ? project.get('id') : null;
        let projectList = this.props.projectList;
        let instanceName = this.props.instanceName;
        let instanceNameClasses = "form-group";
        let errorMessage = null;

        if (this.props.showValidationErr) {
            errorMessage = instanceName == "" ? "This field is rquired" : null;
            instanceNameClasses = instanceName == "" ? "form-group has-error" : "form-group";
        }

        return (
            <form>
                <div className={instanceNameClasses} >
                    <label htmlFor="instanceName">
                        Instance Name
                    </label>
                    <input required type="Name"
                        className="form-control"
                        id="instanceName"
                        value={instanceName}
                        ref="nameInput"
                        onChange={this.props.onNameChange}
                        onBlur={this.props.onNameBlur}
                    />
                    <span className="help-block">{ errorMessage }</span>
                </div>
                <div className="form-group">
                    <label htmlFor="imageVersion">
                        Base Image Version
                    </label>
                    <SelectMenu
                        defaultId={imageVersionId}
                        list={this.props.imageVersionList}
                        optionName={item => item.get('name')}
                        onSelectChange={this.props.onVersionChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="project">
                        Project
                    </label>
                    <SelectMenu
                        defaultId={projectId}
                        list={projectList}
                        optionName={item => item.get('name')}
                        onSelectChange={this.props.onProjectChange}
                    />
                </div>
            </form>
        );
    },
});
