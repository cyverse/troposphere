
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

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onLaunch: React.PropTypes.func.isRequired
      },

      render: function () {
        var image = this.props.image;
        var versions = stores.ImageStore.getVersions(image.id);
        var type = stores.ProfileStore.get().get('icon_set');

        var iconSize = 145;
        var icon;
        if (image.get('icon')) {
          icon = (
            <img src={image.get('icon')} width={iconSize} height={iconSize}/>
          );
        } else {
          icon = (
            <Gravatar hash={image.get('uuid_hash')} size={iconSize} type={type}/>
          );
        }

        // Hide bookmarking on the public page
        var bookmark;
        if (context.profile) {
          bookmark = (
            <Bookmark image={image}/>
          );
        }
        //When versions is 'not loaded' OR 'has length > 0', you can launch.
        var canLaunch = (versions !== null && versions.length !== 0) ? true : false;
        var button;
        if (context.profile) {
          button = (
            <button className='btn btn-primary launch-button' onClick={this.props.onLaunch} disabled={!canLaunch}>
              Launch
            </button>
          );
        } else {
          var loginUrl = URL.login(null, {relative: true}),
            imageUrl = URL.image(this.props.image),
            fullUrl = loginUrl + "?redirect=" + imageUrl + "?beta=true";

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
