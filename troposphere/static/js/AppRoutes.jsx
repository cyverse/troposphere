import React from "react";
import { Route,
         IndexRoute,
         IndexRedirect } from "react-router";

import globals from "globals";

import Master from "./components/Master";
import BadgeMaster from "./components/badges/BadgeMaster";
import MyBadges from "./components/badges/MyBadges";
import AllBadges from "./components/badges/AllBadges";
import UnearnedBadges from "./components/badges/UnearnedBadges";
import RequestHistory from "./components/requests/ResourceHistoryMaster";
import RequestMaster from "./components/requests/RequestMaster";
import DashboardPage from "./components/dashboard/DashboardPage";
import ImageListPage from "./components/images/ImageListPage";
import ImageDetailsPage from "./components/images/ImageDetailsPage";
import ProvidersMaster from "./components/providers/ProvidersMaster";
import ProviderListSection from "./components/providers/ProviderListSection";
import ProviderDetail from "./components/providers/ProviderDetail";
import HelpPage from "./components/help/HelpPage";
import ProjectsMaster from "./components/projects/ProjectsMaster";
import ProjectListPage from "./components/projects/ProjectListPage";
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
/* TODO: enable/disable based on:
import IdentityInstancePage from "./components/identities/InstanceDetailsPage";
import IdentityVolumePage from "./components/identities/VolumeDetailsPage";
import IdentitiesMaster from "./components/identities/IdentitiesMaster";
import IdentityListPage from "./components/identities/IdentityListPage";
import IdentityDetailsMaster from "./components/identities/detail/IdentityDetailsMaster";
import IdentityDetailsPage from "./components/identities/IdentityDetailsPage";
import IdentityResourcesPage from "./components/identities/IdentityResourcesPage";
*/
import AdminMaster from "./components/admin/AdminMaster";
import AtmosphereUserMaster from "./components/admin/AtmosphereUserMaster";
import GroupMaster from "./components/admin/GroupMaster";
import ImageMaster from "./components/admin/ImageMaster";
import ImageRequest from "./components/admin/ImageRequest";
import IdentityMembershipMaster from "./components/admin/IdentityMembershipMaster";
import NotFoundPage from "./components/NotFoundPage";
import ResourceMaster from "./components/admin/ResourceMaster";
import ResourceRequest from "./components/admin/ResourceRequest/ResourceRequest";

const providersRoute = (
<Route path="providers" component={ProvidersMaster}>
    <IndexRoute component={ProviderListSection} />
    <Route path=":id" component={ProviderDetail} />
    <Route path="all" component={ProviderListSection} />
</Route>
)

function AppRoutes(props) {
    const { profile } = props;

    const staffOnly = (StaffView, PubView) => {
        return profile.get('is_staff') ? StaffView : PubView;
    };

    return (
        <Route path="/" component={Master}>
            <Route path="dashboard" component={DashboardPage} />
            <Route path="projects" component={ProjectsMaster}>
                <Route path=":projectId" component={ProjectDetailsMaster}>
                    <Route path="details" component={ProjectDetailsPage} />
                    <Route path="resources" component={ProjectResourcesPage} />
                    <Route path="instances/:instanceId" component={ProjectInstancePage} />
                    <Route path="volumes/:volumeId" component={ProjectVolumePage} />
                    <Route path="links/:linkId" component={ProjectLinkPage} />
                    <IndexRoute component={ProjectDetailsPage} />
                </Route>
                <IndexRoute component={ProjectListPage} />
            </Route>
            {/* TODO: enable/disable based on:
            if(featureFlags.showIdentityView()) {
                <Route path="identities" component={IdentitiesMaster}>
                    <Route path=":identityId" component={IdentityDetailsMaster}>
                        <Route path="details" component={IdentityDetailsPage} />
                        <Route path="resources" component={IdentityResourcesPage} />
                        <Route path="instances/:instanceId" component={IdentityInstancePage} />
                        <Route path="volumes/:volumeId" component={IdentityVolumePage} />
                        <IndexRoute component={IdentityDetailsPage} />
                    </Route>
                    <IndexRoute component={IdentityListPage} />
                </Route>
            }
            */}
            <Route path="images" component={ImagesMaster}>
                <IndexRedirect to="search" />
                <Route path="search" component={ImageListPage} />
                <Route path="favorites" component={FavoritedImagesPage} />
                <Route path="authored" component={MyImagesPage} />
                <Route path="my-image-requests" component={MyImageRequestsPage} />
                <Route path="tags" component={ImageTagsPage} />
                <Route path=":imageId" component={ImageDetailsPage} />
            </Route>
            {globals.USE_ALLOCATION_SOURCES
             ? null
             : providersRoute}
            <Route path="help" component={HelpPage} />
            <Route path="settings" component={SettingsPage} />
            <Route
                path="admin"
                component={staffOnly(
                    AdminMaster, NotFoundPage
                )}
            >
                <Route path="users" component={AtmosphereUserMaster} />
                <Route path="groups" component={GroupMaster} />
                <Route path="identities" component={IdentityMembershipMaster} />
                <Route path="resource-requests" component={ResourceMaster}>
                    <Route path=":id" component={ResourceRequest} />
                </Route>
                <Route path="imaging-requests" component={ImageMaster}>
                    <Route path=":id" component={ImageRequest} />
                </Route>
                <IndexRoute component={ImageMaster} />
            </Route>
            <Route path="badges" component={BadgeMaster}>
                <Route path="my-badges" component={MyBadges} />
                <Route path="all-badges" component={AllBadges} />
                <Route path="unearned-badges" component={UnearnedBadges} />
            </Route>
            <Route path="my-requests" component={RequestMaster}>
                <Route path="resources" component={RequestHistory} />
                <Route path="images" component={MyImageRequestsPage} />
            </Route>
            <Route path="instances/:id" component={NewInstanceDetail} />
            <IndexRoute component={DashboardPage} />
            <IndexRedirect to="dashboard" />
        </Route>
    )
}


export default AppRoutes;
