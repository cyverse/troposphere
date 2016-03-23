define(function (require) {

  var React = require('react/addons'),
    context = require('context'),
    Router = require('react-router'),
    stores = require('stores'),
    SecondaryImageNavigation = require('./common/SecondaryImageNavigation.react'),
    ImageDetailsView = require('./detail/ImageDetailsView.react');

  return React.createClass({
    displayName: "ImageDetailsPage",

    mixins: [Router.State],

    renderBody: function(){
      var image = stores.ImageStore.get(Number(this.getParams().imageId)),
        tags = stores.TagStore.getAll(),
        hasUserLoggedIn = context.hasLoggedInUser(),
        providers = hasUserLoggedIn ? stores.ProviderStore.getAll() : null,
        identities = hasUserLoggedIn ? stores.IdentityStore.getAll() : null;

      if(!image || !tags) return <div className='loading'></div>;

      // If the user isn't logged in, display the public view, otherwise
      // wait for providers and instances to be fetched
      if (!hasUserLoggedIn) {
        return (
          <ImageDetailsView
            image={image}
            tags={tags}
            />
        );
      }

      if (!providers || !identities) return <div className='loading'></div>;

      return (
        <ImageDetailsView
          image={image}
          providers={providers}
          identities={identities}
          tags={tags}
          />
      );
    },

    render: function () {
      return (
        <div className="container">
          {this.renderBody()}
        </div>
      );
    }

  });

});
