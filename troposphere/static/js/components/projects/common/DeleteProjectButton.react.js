import React from 'react';
import modals from 'modals';
import stores from 'stores';

import { DeleteIcon } from 'troposphere-ui/icons';

export default React.createClass({
    displayName: "DeleteProjectButton",
    
    proptypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onDeleteProject: function(e) {
        e.preventDefault();

        var project = this.props.project,
            projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
            projectImages = stores.ProjectImageStore.getImagesFor(project),
            projectExternalLinks = stores.ProjectExternalLinkStore.getExternalLinksFor(project),
            projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project);

        if (
            projectInstances.length > 0 
            || projectImages.length > 0 
            || projectExternalLinks.length > 0 
            || projectVolumes.length > 0
        ) {
            modals.ProjectModals.explainProjectDeleteConditions();
        } else {
            modals.ProjectModals.destroy(project);
        }
    },

    render() {
        return ( 
            <span onClick={ this.onDeleteProject } >
                <DeleteIcon 
                    size={ 20 }
                />
            </span>
        )
    },
});
