
define(
  [
    'react',
    'components/common/Gravatar.react',
    'backbone',
    'url',
    'components/images/common/Bookmark.react',
    'context',
    'stores'
  ],
  function (React, Gravatar, Backbone, URL, Bookmark, context, stores) {

    return React.createClass({
      displayName: "ImageLaunchCard",

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onLaunch: React.PropTypes.func.isRequired
      },

      render: function () {
        var image = this.props.image;
        var versions = stores.ImageStore.getVersions(image.id);
        var type = stores.ProfileStore.get().get('icon_set');
        var hasUserLoggedIn = context.hasLoggedInUser();

        var iconSize = 145;
        // always use the Gravatar icons
        var icon = (
            <Gravatar hash={image.get('uuid_hash')} size={iconSize} type={type}/>
          );

        // Hide bookmarking on the public page
        var bookmark;
        if (hasUserLoggedIn) {
          bookmark = (
            <Bookmark image={image}/>
          );
        }
        //When versions is 'not loaded' OR 'has length > 0', you can launch.
        var canLaunch = (versions !== null && versions.length !== 0) ? true : false;
        var button;
        if (hasUserLoggedIn) {
          button = (
            <button className='btn btn-primary launch-button'
                onClick={this.props.onLaunch}
                disabled={!canLaunch}>
              Launch
            </button>
          );
        } else {
          var loginUrl = URL.login(null, {relative: true}),
            imageUrl = URL.image(this.props.image),
            fullUrl = loginUrl + "?redirect=" + imageUrl + "?beta=true&airport_ui=false";

          button = (
            <a className='btn btn-primary launch-button' href={fullUrl}>
              Login to Launch
            </a>
          );
        }

        return (
          <div className='image-launch-card'>
            <div className='icon-container'>
              <a>
                {icon}
              </a>
            </div>
            {button}
            {bookmark}
          </div>
        );
      }

    });

  });
