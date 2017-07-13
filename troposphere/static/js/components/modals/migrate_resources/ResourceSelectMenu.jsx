import React from "react";
import subscribe from "utilities/subscribe";
import Backbone from "backbone";
import Instance from "models/Instance";
import Volume from "models/Volume";
import SelectMenu from "components/common/ui/SelectMenu";

const ResourceSelectMenu = React.createClass({
    displayName: "ResourceSelectMenu",

    propTypes: {
        resource: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model),
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onProjectSelected: React.PropTypes.func.isRequired,
        optionName: React.PropTypes.func,
    },
    getInitialState: function() {
        return {
            limitedProjects: null
        };
    },
    renderSelectMenu() {
        let { projects, project, optionName } = this.props;
        let projectTip = (projects.length > 0) ? "Select a Project": "Create a Project";
        if(!optionName) {
            optionName = p => p.get("name");
        }
        return (
            <span style={{ width: "40%" }}>
                <SelectMenu
                    className={"form-control"}
                    current={project}
                    list={projects}
                    placeholder={projectTip}
                    onSelect={p => this.onProjectSelected(p)}
                    optionName={optionName} />
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

export default subscribe(ResourceSelectMenu, ["ProjectStore"]);
