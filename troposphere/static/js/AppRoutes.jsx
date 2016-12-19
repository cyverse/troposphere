import React from "react";
import { Router,
         Route,
         IndexRoute,
         browserHistory } from "react-router";

import globals from "globals";


import Master from "./components/Master";
import BadgeMaster from "./components/badges/BadgeMaster";
import MyBadges from "./components/badges/MyBadges";
import AllBadges from "./components/badges/AllBadges";
import UnearnedBadges from "./components/badges/UnearnedBadges";
import RequestHistory from "./components/requests/ResourceHistoryMaster";
import RequestMaster from "./components/requests/RequestMaster";
import DashboardPage from "./components/dashboard/DashboardPage";
import ProjectListPage from "./components/projects/ProjectListPage";
import ImageListPage from "./components/images/ImageListPage";
import ImageDetailsPage from "./components/images/ImageDetailsPage";
import ProvidersMaster from "./components/providers/ProvidersMaster";
import ProviderListSection from "./components/providers/ProviderListSection";
import ProviderDetail from "./components/providers/ProviderDetail";
import HelpPage from "./components/help/HelpPage";
import ProjectsMaster from "./components/projects/ProjectsMaster";
import ProjectDetailsMaster from "./components/projects/detail/ProjectDetailsMaster";
import ProjectDetailsPage from "./components/projects/ProjectDetailsPage";
import ProjectResourcesPage from "./components/projects/ProjectResourcesPage";
import FavoritedImagesPage from "./components/images/FavoritedImagesPage";
import MyImagesPage from "./components/images/MyImagesPage";
import MyImageRequestsPage from "./components/images/MyImageRequestsPage";
import ImageTagsPage from "./components/images/ImageTagsPage";
import ImagesMaster from "./components/images/ImagesMaster";
import NewInstanceDetail from "./components/common/InstanceDetail";
import SettingsPage from "./components/settings/SettingsPage";
import ProjectInstancePage from "./components/projects/InstanceDetailsPage";
import ProjectVolumePage from "./components/projects/VolumeDetailsPage";
import ProjectLinkPage from "./components/projects/ExternalLinkDetailsPage";
import AdminMaster from "./components/admin/AdminMaster";
import AtmosphereUserMaster from "./components/admin/AtmosphereUserMaster";
import ImageMaster from "./components/admin/ImageMaster";
import ImageRequest from "./components/admin/ImageRequest";
import IdentityMembershipMaster from "./components/admin/IdentityMembershipMaster";

const providersRoute = (
<Route name="providers" component={ProvidersMaster}>
    <IndexRoute component={ProviderListSection} />
    <Route name="provider" path=":id" component={ProviderDetail} />
    <Route name="all-providers" path="/" component={ProviderListSection} />
</Route>
)

const appRoutes = (
<Route name="root" path="/application" component={Master}>
    <Route name="dashboard" component={DashboardPage} />
    <Route name="projects" component={ProjectsMaster}>
        <Route name="project" path=":projectId" component={ProjectDetailsMaster}>
            <Route name="project-details" path="details" component={ProjectDetailsPage} />
            <Route name="project-resources" path="resources" component={ProjectResourcesPage} />
            <Route name="project-instance-details" path="instances/:instanceId" component={ProjectInstancePage} />
            <Route name="project-volume-details" path="volumes/:volumeId" component={ProjectVolumePage} />
            <Route name="project-link-details" path="links/:linkId" component={ProjectLinkPage} />
            <IndexRoute component={ProjectDetailsPage} />
        </Route>
        <IndexRoute component={ProjectListPage} />
    </Route>
    <Route name="images" component={ImagesMaster}>
        <IndexRoute name="search" component={ImageListPage} />
        <Route name="favorites" component={FavoritedImagesPage} />
        <Route name="authored" component={MyImagesPage} />
        <Route name="my-image-requests" component={MyImageRequestsPage} />
        <Route name="tags" component={ImageTagsPage} />
        <Route name="image-details" path=":imageId" component={ImageDetailsPage} />
    </Route>
    {globals.USE_ALLOCATION_SOURCES
     ? null
     : providersRoute}
    <Route name="help" component={HelpPage} />
    <Route name="settings" component={SettingsPage} />
    <Route name="admin" component={AdminMaster}>
        <Route name="atmosphere-user-manager" path="users" component={AtmosphereUserMaster} />
        <Route name="identity-membership-manager" path="identities" component={IdentityMembershipMaster} />
        <Route name="image-request-manager" path="imaging-requests" component={ImageMaster}>
            <Route name="image-request-detail" path=":id" component={ImageRequest} />
        </Route>
        <IndexRoute component={AtmosphereUserMaster} />
    </Route>
    <Route name="badges" component={BadgeMaster}>
        <Route name="my-badges" path="my-badges" component={MyBadges} />
        <Route name="all-badges" path="all-badges" component={AllBadges} />
        <Route name="unearned-badges" path="unearned-badges" component={UnearnedBadges} />
    </Route>
    <Route name="my-requests" component={RequestMaster}>
        <Route name="my-requests-resources" path="resources" component={RequestHistory} />
        <Route name="my-requests-images" path="images" component={MyImageRequestsPage} />
    </Route>
    <Route name="instances">
        <Route name="new-instance-detail" path=":id" component={NewInstanceDetail} />
    </Route>
    <IndexRoute component={DashboardPage} />
</Route>
);

export default appRoutes;
