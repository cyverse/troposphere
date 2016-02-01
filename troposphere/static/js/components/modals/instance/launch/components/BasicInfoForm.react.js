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

   render: function () {
        if (!this.props.projectList || !this.props.imageVersion || !this.props.imageVersionList || !this.props.project) {
            return (<div className="loading"/>);
        }

        let imageVersionId = this.props.imageVersion.get('id');
        let project = this.props.project;
        let projectList = this.props.projectList;
        let instanceName = 
            this.props.instanceName == null 
            ? this.props.image.get("name")
            : this.props.instanceName;

        return (
            <form>
                <div className={ "form-group " + (instanceName == "" ? "has-error" : "") } >
                    <label for="instanceName">
                        Instance Name
                    </label>
                    <input required type="Name" className="form-control" id="instanceName" value={instanceName}
                        onChange={this.props.onNameChange}/>
                </div>
                <div className="form-group">
                    <label for="imageVersion">
                        Base Image Version
                    </label>
                    <SelectMenu
                        defaultId={this.props.imageVersion.get('id')}
                        list={this.props.imageVersionList}
                        optionName={item => item.get('name')}
                        onSelectChange={this.props.onVersionChange}/>
                </div>
                <div className="form-group">
                    <label for="project">
                        Project
                    </label>
                    <SelectMenu
                        defaultId={project.id}
                        list={projectList}
                        optionName={item => item.get('name')}
                        onSelectChange={this.props.onProjectChange}/>
                </div>
            </form>
        );
    },
});
