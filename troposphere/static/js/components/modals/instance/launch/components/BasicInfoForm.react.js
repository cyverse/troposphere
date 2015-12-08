import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import SelectMenu from 'components/common/ui/SelectMenu.react';

export default React.createClass({
    getInitialState: function() {
        let defaultVersion = this.props.defaultVersion;
        let defaultProject = this.props.defaultProject;

        return ({
            version: defaultVersion,
            project: defaultProject
        });
    },

    onVersionChange: function(value){
        console.log(value);
        this.setState({version:value});
    },

    onProjectChange: function(value){
        console.log(value);
        this.setState({project:value});
    },

    render: function () {
        let name = function(item) { return item.get('name')};
        let defaultProjectId = this.props.defaultProject.attributes.id;
        let projects = this.props.projects;
        let imageName = this.props.imageBase.attributes.name;
        let imageVersions = this.props.imageVersions;
        let latestImageVersionId = 2;

        return (
            <form>
                <div className="form-group">
                    <label for="instanceName">
                        Instance Name
                    </label>
                    <input type="Name" className="form-control" id="instanceName" value={imageName}/>
                </div>
                <div className="form-group">
                    <label for="imageVersion">
                        Base Image Version
                    </label>
                    <SelectMenu
                        defaultId={latestImageVersionId}
                        list={imageVersions}
                        optionName={name}
                        onSelectChange={this.onVersionChange}/>
                </div>
                <div className="form-group">
                    <label for="project">
                        Project
                    </label>
                    <SelectMenu
                        defaultId={defaultProjectId}
                        list={projects}
                        optionName={name}
                        onSelectChange={this.onProjectChange}/>
                </div>
            </form>
        );
    },
});
