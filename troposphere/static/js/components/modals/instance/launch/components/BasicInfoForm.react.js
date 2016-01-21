import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import SelectMenu from 'components/common/ui/SelectMenu.react';

export default React.createClass({

    // TODO: Its not clear what the interface for this method is, what props
    // do i need to pass? One way to resolve this is to fill out prop types,
    // or to make aliases to every prop at the top of the func, like 
    //  var im = this.props.imageVersion
   render: function () {
        if (!this.props.imageVersion || !this.props.imageVersionList) {
            return (<div className="loading"/>);
        }

        let imageVersionId = this.props.imageVersion.get('id');
        let project = this.props.project;
        let instanceName = this.props.instanceName || this.props.imageName;
        console.log("BasicInfoForm i img?", this.props.instanceName, this.props.imageName);

        return (
            <form>
                <div className="form-group">
                    <label for="instanceName">
                        Instance Name
                    </label>
                    <input type="Name" className="form-control" id="instanceName" value={instanceName}
                        onChange={(e) => this.props.onNameChange(e.target.value)}/>
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
                        defaultId={this.props.project.id}
                        list={this.props.projectList}
                        optionName={item => item.get('name')}
                        onSelectChange={this.props.onProjectChange}/>
                </div>
            </form>
        );
    },
});
