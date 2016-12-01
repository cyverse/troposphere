import React from "react";
import Backbone from "backbone";
import Instance from "models/Instance";
import Volume from "models/Volume";
import SelectMenu from "components/common/ui/SelectMenu";

export default React.createClass({
    displayName: "ResourceSelectMenu",

    propTypes: {
        resource: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onProjectSelected: React.PropTypes.func.isRequired
    },

    renderSelectMenu() {
        let { projects } = this.props;
        let project = this.props.project;
        //FIXME: Limit *projects* to the ones that are *allowed* based on the *identity* that launched it.
        return (
            <span style={{ width: "40%" }}>
                <SelectMenu
                    current={project}
                    list={projects}
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
