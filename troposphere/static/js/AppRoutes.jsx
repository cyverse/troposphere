import React from "react";
import Router from "react-router";
import globals from "globals";

let Route = Router.Route,
    DefaultRoute = Router.DefaultRoute;

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
<Route name="providers" handler={ProvidersMaster}>
    <DefaultRoute handler={ProviderListSection} />
    <Route name="provider" path=":id" handler={ProviderDetail} />
    <Route name="all-providers" path="/" handler={ProviderListSection} />
</Route>
)

const appRoutes = (
<Route name="root" path="/application" handler={Master}>
    <Route name="dashboard" handler={DashboardPage} />
    <Route name="projects" handler={ProjectsMaster}>
        <Route name="project" path=":projectId" handler={ProjectDetailsMaster}>
            <Route name="project-details" path="details" handler={ProjectDetailsPage} />
            <Route name="project-resources" path="resources" handler={ProjectResourcesPage} />
            <Route name="project-instance-details" path="instances/:instanceId" handler={ProjectInstancePage} />
            <Route name="project-volume-details" path="volumes/:volumeId" handler={ProjectVolumePage} />
            <Route name="project-link-details" path="links/:linkId" handler={ProjectLinkPage} />
            <DefaultRoute handler={ProjectDetailsPage} />
        </Route>
        <DefaultRoute handler={ProjectListPage} />
    </Route>
    <Route name="images" handler={ImagesMaster}>
        <DefaultRoute name="search" handler={ImageListPage} />
        <Route name="favorites" handler={FavoritedImagesPage} />
        <Route name="authored" handler={MyImagesPage} />
        <Route name="my-image-requests" handler={MyImageRequestsPage} />
        <Route name="tags" handler={ImageTagsPage} />
        <Route name="image-details" path=":imageId" handler={ImageDetailsPage} />
    </Route>
    {globals.USE_ALLOCATION_SOURCES
     ? null
     : providersRoute}
    <Route name="help" handler={HelpPage} />
    <Route name="settings" handler={SettingsPage} />
    <Route name="admin" handler={AdminMaster}>
        <Route name="atmosphere-user-manager" path="users" handler={AtmosphereUserMaster} />
        <Route name="identity-membership-manager" path="identities" handler={IdentityMembershipMaster} />
        <Route name="image-request-manager" path="imaging-requests" handler={ImageMaster}>
            <Route name="image-request-detail" path=":id" handler={ImageRequest} />
        </Route>
        <DefaultRoute handler={AtmosphereUserMaster} />
    </Route>
    <Route name="badges" handler={BadgeMaster}>
        <Route name="my-badges" path="my-badges" handler={MyBadges} />
        <Route name="all-badges" path="all-badges" handler={AllBadges} />
        <Route name="unearned-badges" path="unearned-badges" handler={UnearnedBadges} />
    </Route>
    <Route name="my-requests" handler={RequestMaster}>
        <Route name="my-requests-resources" path="resources" handler={RequestHistory} />
        <Route name="my-requests-images" path="images" handler={MyImageRequestsPage} />
    </Route>
    <Route name="instances">
        <Route name="new-instance-detail" path=":id" handler={NewInstanceDetail} />
    </Route>
    <DefaultRoute handler={DashboardPage} />
</Route>
);

export default appRoutes;
