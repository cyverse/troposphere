
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

let AppRoutes = (
    <Route name="root" path="/image" handler={Master}>
      <Route name="images" handler={ImagesMaster}>
        <DefaultRoute name="search" handler={ImageListPage}/>
        <Route name="tags" handler={ImageTagsPage}/>
        <Route name="image-details" path=":imageId" handler={ImageDetailsPage}/>
      </Route>
      <Route name="help" handler={HelpPage}/>
      <Redirect from="/image" to="/application/images"/>
    </Route>
);

export default AppRoutes;
