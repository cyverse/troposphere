import React from "react";
import stores from "stores";
import Backbone from "backbone";
import Instance from "models/Instance";
import Volume from "models/Volume";
import SelectMenu from "components/common/ui/SelectMenu";

export default React.createClass({
    displayName: "ResourceSelectMenu",

    propTypes: {
        resource: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model),
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onProjectSelected: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        let { resource } = this.props;
        let limitedProjects = stores.ProjectStore.getProjectsForIdentity(resource.get('identity'));

        return {
            limitedProjects,
        };
    },
    updateState: function() {
        let { limitedProjects } = this.state;
        let { resource } = this.props;

        limitedProjects = stores.ProjectStore.getProjectsForIdentity(resource.get('identity'));

        if (limitedProjects !== this.state.limitedProjects) {
            this.setState({
                limitedProjects
            });
        }
    },
    componentDidMount: function() {
        stores.ProjectStore.addChangeListener(this.updateState);

        this.updateState();
    },
    componentWillUnmount: function() {
        stores.ProjectStore.removeChangeListener(this.updateState);
    },
    renderSelectMenu() {
        let { projects } = this.props;
        let { resource, project } = this.props;
        let limitProjects= this.state.limitedProjects;
        if(!limitProjects) {
            return (<div className="loading-tiny-inline" />);
        }
        //FIXME: Limit *projects* to the ones that are *allowed* based on the *identity* that launched it.
        return (
            <span style={{ width: "40%" }}>
                <SelectMenu
                    className={""}
                    current={project}
                    list={limitProjects}
                    placeholder={"Select a project"}
                    onSelect={p => this.onProjectSelected(p)}
                    optionName={p => p.get("name")} />
            </span>
        )
    },

    onProjectSelected(project) {
        this.props.onProjectSelected(this.props.resource, project);
    },

    render: function() {
        var resource = this.props.resource;
        let resource_type = "Resource";

        if (resource instanceof Instance) {
            resource_type = "Instance";
        } else if (resource instanceof Volume) {
            resource_type = "Volume";
        }

        return (
        <li>
            <b style={{ whiteSpace: "nowrap" }}>
                {resource_type + ": "}
            </b>
            {resource.get("name")}
            {this.renderSelectMenu()}
        </li>
        );
    }
});
