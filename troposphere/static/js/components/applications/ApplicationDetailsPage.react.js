define(function (require) {

  var React = require('react'),
      context = require('context'),
      Router = require('react-router'),
      stores = require('stores'),
      SecondaryApplicationNavigation = require('./common/SecondaryApplicationNavigation.react'),
      ApplicationDetailsView = require('./detail/ApplicationDetailsView.react');

  return React.createClass({

    mixins: [Router.State],

    renderBody: function(){
      var application = stores.ApplicationStore.get(this.getParams().imageId),
          tags = stores.TagStore.getAll(),
          userLoggedIn = context.profile,
          providers = userLoggedIn ? stores.ProviderStore.getAll() : null,
          identities = userLoggedIn ? stores.IdentityStore.getAll() : null;

      if(!application || !tags) return <div className='loading'></div>;

      // If the user isn't logged in, display the public view, otherwise
      // wait for providers and instances to be fetched
      if(!userLoggedIn){
        return (
          <ApplicationDetailsView
            application={application}
            tags={tags}
          />
        );
      }

      if(!providers || !identities) return <div className='loading'></div>;

      return (
        <ApplicationDetailsView
          application={application}
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
