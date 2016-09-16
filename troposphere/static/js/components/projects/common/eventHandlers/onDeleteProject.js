import modals from 'modals';
import stores from 'stores';

const onDeleteProject = (project) => {

    var projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
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
};

export default onDeleteProject
