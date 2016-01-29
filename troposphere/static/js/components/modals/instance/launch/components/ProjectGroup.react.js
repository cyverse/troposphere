import React from 'react';
import SelectMenu from 'components/common/ui/SelectMenu.react';

export default React.createClass({

    render: function() {
        if (this.props.projectList) {
            return (
                <form>
                <div className="form-group">
                    <label htmlfor="newProject">
                        Create a New Project for your instance
                    </label>
                    <input className="form-control" id="newProject" placeholder="Password"/>
                </div>
                <button
                    className="btn btn-primary pull-right"
                    defaultId={this.props.project.id}
                    list={this.props.projectList}
                    optionName={item => item.get('name')}
                    onSelectChange={this.props.onProjectChange}
                >
                    New Project
                </button>
                </form>
            );
        }

        return (
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
        )
    }
});
