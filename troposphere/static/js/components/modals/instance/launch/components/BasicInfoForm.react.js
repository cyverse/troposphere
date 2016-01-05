import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import SelectMenu from 'components/common/ui/SelectMenu.react';

export default React.createClass({

    componentDidMount: function() {
        console.log("Basic Form", this.props);
    },

    render: function () {
        if (!this.props.imageVersion || !this.props.imageVersions) {
            return (<div className="loading"/>);
        }

        let name = function(item) { return item.get('name') };
        let imageName = this.props.image.get('name');
        let imageVersionId = this.props.imageVersion.get('id');
        return (
            <form>
                <div className="form-group">
                    <label for="instanceName">
                        Instance Name
                    </label>
                    <input type="Name" className="form-control" id="instanceName" value={imageName}
                        onChange={this.props.onNameChange}/>
                </div>
                <div className="form-group">
                    <label for="imageVersion">
                        Base Image Version
                    </label>
                    <SelectMenu
                        defaultId={this.props.imageVersion.get('id')}
                        list={this.props.imageVersions}
                        optionName={name}
                        onSelectChange={this.props.onVersionChange}/>
                </div>
                <div className="form-group">
                    <label for="project">
                        Project
                    </label>
                    <SelectMenu
                        defaultId={this.props.project.id}
                        list={this.props.projects}
                        optionName={name}
                        onSelectChange={this.props.onProjectChange}/>
                </div>
            </form>
        );
    },
});
