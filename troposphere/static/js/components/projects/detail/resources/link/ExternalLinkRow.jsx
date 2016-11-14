import React from "react";
import Backbone from "backbone";
import SelectableRow from "../SelectableRow";
import Name from "../tableData/link/Name";
import Link from "../tableData/link/Link";


export default React.createClass({
    displayName: "ExternalLinkRow",

    propTypes: {
        external_link: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,
        onPreviewResource: React.PropTypes.func.isRequired,
        isPreviewed: React.PropTypes.bool,
        isChecked: React.PropTypes.bool
    },

    render: function() {
        var external_link = this.props.external_link;

        return (
        <SelectableRow isActive={this.props.isPreviewed}
            isSelected={this.props.isChecked}
            onResourceSelected={this.props.onResourceSelected}
            onResourceDeselected={this.props.onResourceDeselected}
            onPreviewResource={this.props.onPreviewResource}
            resource={external_link}>
            <td className="image-preview sm-cell" data-label="Name">
                <Name external_link={external_link} />
            </td>
            <td className="image-preview sm-cell" data-label="Link">
                <Link external_link={external_link} />
            </td>
        </SelectableRow>
        );
    }
});
