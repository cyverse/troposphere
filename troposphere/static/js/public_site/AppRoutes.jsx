import React from "react";
import { Route,
         IndexRedirect,
         IndexRoute } from "react-router";

import Master from "components/Master";
import HelpPage from "components/help/HelpPage";
import ImageListPage from "components/images/ImageListPage";
import ImageDetailsPage from "components/images/ImageDetailsPage";
import ImageTagsPage from "components/images/ImageTagsPage";
import ImagesMaster from "components/images/ImagesMaster";
import NotFoundPage from "components/NotFoundPage";


let AppRoutes = (
    <Route path="/" component={Master}>
        <Route path="images" component={ImagesMaster}>
            <IndexRoute component={ImageListPage} />
            <Route path="search" component={ImageListPage}/>
            <Route path="tags" component={ImageTagsPage} />
            <Route path=":imageId" component={ImageDetailsPage} />
        </Route>
        <Route path="help" component={HelpPage} />
        <IndexRedirect to="images" />
        <Route path="*" component={NotFoundPage} />
    </Route>
);

export default AppRoutes;
