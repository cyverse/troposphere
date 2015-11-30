
import React from 'react/addons';
import Router from 'react-router';

let Route = Router.Route,
    Redirect = Router.Redirect,
    DefaultRoute = Router.DefaultRoute;

import Master from 'components/Master.react';
import HelpPage from 'components/help/HelpPage.react';
import ImageListPage from 'components/images/ImageListPage.react';
import ImageDetailsPage from 'components/images/ImageDetailsPage.react';
import ImageTagsPage from 'components/images/ImageTagsPage.react';
import ImagesMaster from 'components/images/ImagesMaster.react';

// I do not believe this 3 component makes sense for a public site
import FavoritedImagesPage from 'components/images/FavoritedImagesPage.react';
import MyImagesPage from 'components/images/MyImagesPage.react';
import MyImageRequestsPage from 'components/images/MyImageRequestsPage.react';


let AppRoutes = (
    <Route name="root" path="/application" handler={Master}>
      <Route name="images" handler={ImagesMaster}>
        <DefaultRoute name="search" handler={ImageListPage}/>
        <Route name="favorites" handler={FavoritedImagesPage}/>
        <Route name="authored" handler={MyImagesPage}/>
        <Route name="my-image-requests" handler={MyImageRequestsPage}/>
        <Route name="tags" handler={ImageTagsPage}/>
        <Route name="image-details" path=":imageId" handler={ImageDetailsPage}/>
      </Route>
      <Route name="help" handler={HelpPage}/>
      <Redirect from="/application" to="/application/images"/>
    </Route>
);

export default AppRoutes;
