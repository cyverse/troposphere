define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      RouteHandler = Router.RouteHandler,
      actions = require('actions');
      //ImageActions = require('actions/ImageActions');

  return React.createClass({

    mixins: [Router.State],

    render: function () {
      var imageRequests = stores.ImageRequestStore.getAll();
      console.log(imageRequests);
      return(
        <div className="image-master">
        <h1>Imaging Requests</h1>
          <Router.Link to="image-request" params={{imagingRequestId: 1}}>
            <div><img src={"https://i.imgflip.com/oa9x2.jpg"}/></div>
          </Router.Link>
        <RouteHandler />
        </div>
      );
    }
  });
}); 

