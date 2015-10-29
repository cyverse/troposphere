
import React from 'react';
import ProjectListView from './list/ProjectListView.react';
import stores from 'stores';

function getProjectState() {
    return {
        projects: stores.ProjectStore.getAll()
    };
}

export default React.createClass({
    displayName: "ProjectListPage",

    //
    // Mounting & State
    // ----------------
    //
    getInitialState: function() {
        return getProjectState();
    },

    updateImages: function() {
        if (this.isMounted()) this.setState(getProjectState());
    },

    componentDidMount: function() {
        stores.ProjectStore.addChangeListener(this.updateImages);
    },

    componentWillUnmount: function() {
        stores.ProjectStore.removeChangeListener(this.updateImages);
    },

    //
    // Render
    // ------
    //
    render: function () {
        if (this.state.projects) {
          return (
            <ProjectListView projects={this.state.projects}/>
          );
        } else {
          return (
            <div className="loading"></div>
          );
        }
    }
});
