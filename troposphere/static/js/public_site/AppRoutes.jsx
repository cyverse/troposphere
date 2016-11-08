import React from "react";
import Router from "react-router";

let Route = Router.Route,
    Redirect = Router.Redirect,
    DefaultRoute = Router.DefaultRoute;

import Master from "components/Master";
import HelpPage from "components/help/HelpPage";
import ImageListPage from "components/images/ImageListPage";
import ImageDetailsPage from "components/images/ImageDetailsPage";
import ImageTagsPage from "components/images/ImageTagsPage";
import ImagesMaster from "components/images/ImagesMaster";
import NotFoundPage from "components/NotFoundPage";

let AppRoutes = (
<Route name="root" path="/application" handler={Master}>
    <Route name="images" handler={ImagesMaster}>
        <DefaultRoute name="search" handler={ImageListPage} />
        <Route name="tags" handler={ImageTagsPage} />
        <Route name="image-details" path=":imageId" handler={ImageDetailsPage} />
    </Route>
    <Route name="help" handler={HelpPage} />
    <Redirect from="/application" to="/application/images" />
    <Route name="not-found" path="*" handler={NotFoundPage} />
</Route>
);

export default AppRoutes;
