import React from "react";
import Backbone from "backbone";
import Version from "./Version";
import ImageVersionEditModal from "components/modals/image_version/ImageVersionEditModal";
import ModalHelpers from "components/modals/ModalHelpers";
import actions from "actions";
import stores from "stores";

export default React.createClass({
    displayName: "VersionList",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        versions: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        editable: React.PropTypes.bool,
        showAvailability: React.PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            showAvailability: true,
            editable: true
        }
    },
    //TODO: Next refactor should convert this into 'edit version'
    openEditVersion: function(version) {

        var props = {
            version: version,
            image: this.props.image
        };

        ModalHelpers.renderModal(ImageVersionEditModal, props, this.onCompletedEdit);

    },
    onCompletedEdit: function(version, name, changeLog, end_date,
                              canImage, image, minCPU, minMem,
                              versionMembership, docObjectId) {
        if (end_date) {
            // Move from datestring to ISO string
            end_date = new Date(Date.parse(end_date)).toISOString()
        } else {
            end_date = null;
        }
        actions.ImageVersionActions.update(version, {
            name: name,
            change_log: changeLog,
            end_date: end_date,
            allow_imaging: canImage,
            image: image.id,
            min_cpu: minCPU,
            min_mem: minMem,
            membership: versionMembership,
            doc_object_id: docObjectId
        });
    },
    renderVersion: function(version) {
        return (
        <Version key={version.id}
            version={version}
            image={this.props.image}
            editable={this.props.editable}
            showAvailability={this.props.showAvailability}
            onEditClicked={this.openEditVersion} />
        );
    },
    getVersions: function(versions) {
        versions = versions || [];

        var partialLoad = false;

        //Wait for it...
        if (!versions) {
            return null;
        }
        versions.map(function(version) {
            var _versions = stores.ImageVersionStore.get(version.id);
            if (!_versions) {
                partialLoad = true;
                return;
            }
            versions = versions.concat(_versions);
        });

        //Don't try to render until you are 100% ready
        if (partialLoad) {
            return null;
        }

        return versions;
    },
    render: function() {

        //TODO: Add 'sort by' && '+/-'
        //      API ordering filters: Start Date _OR_ parent-hierarchy
        return (
        <div className="content">
            <ul className="app-card-list">
                {this.props.versions.map(this.renderVersion)}
            </ul>
        </div>
        );
    }
});
