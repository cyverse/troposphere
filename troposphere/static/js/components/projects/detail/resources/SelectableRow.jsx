import React from "react";
import Backbone from "backbone";
import Checkbox from "./Checkbox";

export default React.createClass({
    displayName: "SelectableRow",

    propTypes: {
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,
        onPreviewResource: React.PropTypes.func.isRequired,
        isActive: React.PropTypes.bool,
        isSelected: React.PropTypes.bool,
        children: React.PropTypes.node.isRequired,
        resource: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    toggleCheckbox: function(e) {
        e.stopPropagation();
        if (this.props.resource && this.props.resource.isNew()) return;

        if (this.props.isSelected) {
            this.props.onResourceDeselected(this.props.resource);
        } else {
            this.props.onResourceSelected(this.props.resource);
        }
    },

    previewResource: function(e) {
        if (this.props.onPreviewResource && this.props.resource.id) {
            this.props.onPreviewResource(this.props.resource);
        }
    },


    render: function() {
        let resource = this.props.resource,
            diminish = resource && resource.isNew() ? 0.32 : 1,
            rowClassName = this.props.isActive ? "selected" : "";

        return (
        <tr className={"sm-row " + rowClassName} style={{ cursor: "pointer" }} onClick={this.previewResource}>
            <td className="sm-cell hidden-xs" style={{ opacity: diminish }} onClick={this.toggleCheckbox}>
                <Checkbox isChecked={this.props.isSelected} />
            </td>
            {this.props.children}
        </tr>
        );
    }
});
